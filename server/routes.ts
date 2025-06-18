import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import { z } from "zod";
import { insertUserSchema, insertLabResultSchema, insertActionPlanSchema, loginSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, and PNG files are allowed.'));
    }
  },
});

// Simple session management (in production, use proper session store)
const sessions = new Map<string, { userId: number; expires: Date }>();

function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function isAuthenticated(req: any): number | null {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  if (!sessionId) return null;

  const session = sessions.get(sessionId);
  if (!session || session.expires < new Date()) {
    sessions.delete(sessionId);
    return null;
  }

  return session.userId;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Create session
      const sessionId = generateSessionId();
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      sessions.set(sessionId, { userId: user.id, expires });

      // Return user data without password
      const { password, ...userWithoutPassword } = user;
      res.json({
        user: userWithoutPassword,
        sessionId,
        expires: expires.toISOString(),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Registration failed" });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Create session
      const sessionId = generateSessionId();
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      sessions.set(sessionId, { userId: user.id, expires });

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({
        user: userWithoutPassword,
        sessionId,
        expires: expires.toISOString(),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Login failed" });
      }
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    if (sessionId) {
      sessions.delete(sessionId);
    }
    res.json({ message: "Logged out successfully" });
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    const userId = isAuthenticated(req);
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  });

  // Lab results routes
  app.get("/api/lab-results", async (req, res) => {
    const userId = isAuthenticated(req);
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const results = await storage.getLabResults(userId, limit);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lab results" });
    }
  });

  app.post("/api/lab-results", async (req, res) => {
    const userId = isAuthenticated(req);
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const labData = insertLabResultSchema.parse({
        ...req.body,
        userId,
        testDate: new Date(req.body.testDate),
      });

      const result = await storage.createLabResult(labData);
      
      // Calculate new health score after adding lab result
      await calculateHealthScore(userId);
      
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create lab result" });
      }
    }
  });

  // File upload route
  app.post("/api/upload", upload.single('file'), async (req, res) => {
    const userId = isAuthenticated(req);
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const fileUpload = await storage.createFileUpload({
        userId,
        fileName: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploadPath: req.file.path,
      });

      res.json({ 
        message: "File uploaded successfully", 
        fileId: fileUpload.id,
        status: "processing" 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to process file upload" });
    }
  });

  // Health score routes
  app.get("/api/health-score", async (req, res) => {
    const userId = isAuthenticated(req);
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const score = await storage.getLatestHealthScore(userId);
      if (!score) {
        // Calculate initial health score if none exists
        const newScore = await calculateHealthScore(userId);
        return res.json(newScore);
      }
      res.json(score);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch health score" });
    }
  });

  app.get("/api/health-score/history", async (req, res) => {
    const userId = isAuthenticated(req);
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const history = await storage.getHealthScoreHistory(userId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch health score history" });
    }
  });

  // Action plans routes
  app.get("/api/action-plans", async (req, res) => {
    const userId = isAuthenticated(req);
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const status = req.query.status as string;
      const plans = await storage.getActionPlans(userId, status);
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch action plans" });
    }
  });

  app.post("/api/action-plans", async (req, res) => {
    const userId = isAuthenticated(req);
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const planData = insertActionPlanSchema.parse({
        ...req.body,
        userId,
      });

      const plan = await storage.createActionPlan(planData);
      res.json(plan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create action plan" });
      }
    }
  });

  app.put("/api/action-plans/:id", async (req, res) => {
    const userId = isAuthenticated(req);
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const planId = parseInt(req.params.id);
      const existingPlan = await storage.getActionPlan(planId);
      
      if (!existingPlan || existingPlan.userId !== userId) {
        return res.status(404).json({ message: "Action plan not found" });
      }

      const updates = req.body;
      const updatedPlan = await storage.updateActionPlan(planId, updates);
      res.json(updatedPlan);
    } catch (error) {
      res.status(500).json({ message: "Failed to update action plan" });
    }
  });

  // AI insights routes
  app.get("/api/insights", async (req, res) => {
    const userId = isAuthenticated(req);
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const insights = await storage.getAiInsights(userId);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI insights" });
    }
  });

  // Trends data route
  app.get("/api/trends/:biomarker", async (req, res) => {
    const userId = isAuthenticated(req);
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const { biomarker } = req.params;
      const timeRange = req.query.range as string || '3M';
      
      let startDate = new Date();
      switch (timeRange) {
        case '3M':
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case '6M':
          startDate.setMonth(startDate.getMonth() - 6);
          break;
        case '1Y':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate = new Date(0); // All time
      }

      const results = await storage.getLabResultsByDateRange(userId, startDate, new Date());
      const biomarkerResults = results.filter(r => 
        r.testName.toLowerCase().includes(biomarker.toLowerCase())
      );

      res.json(biomarkerResults);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trend data" });
    }
  });

  // Biomarkers reference data
  app.get("/api/biomarkers", async (req, res) => {
    try {
      const biomarkers = await storage.getBiomarkers();
      res.json(biomarkers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch biomarkers" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to calculate health score
async function calculateHealthScore(userId: number) {
  try {
    const recentResults = await storage.getLabResults(userId, 20);
    
    // Simple health score calculation based on recent results
    let totalScore = 0;
    let categoryScores = {
      cardiovascular: 0,
      metabolic: 0,
      vitamin: 0,
    };

    // This is a simplified calculation - in production you'd have more sophisticated algorithms
    const scoreMapping = {
      'cholesterol': { category: 'cardiovascular', weight: 0.3 },
      'ldl': { category: 'cardiovascular', weight: 0.2 },
      'hdl': { category: 'cardiovascular', weight: 0.2 },
      'triglycerides': { category: 'cardiovascular', weight: 0.1 },
      'glucose': { category: 'metabolic', weight: 0.3 },
      'hba1c': { category: 'metabolic', weight: 0.4 },
      'vitamin d': { category: 'vitamin', weight: 0.5 },
    };

    for (const result of recentResults) {
      const testName = result.testName.toLowerCase();
      const mapping = Object.entries(scoreMapping).find(([key]) => 
        testName.includes(key)
      );

      if (mapping) {
        const [, config] = mapping;
        // Simple scoring: if within reference range, score is high
        if (result.referenceMin && result.referenceMax) {
          const value = parseFloat(result.value.toString());
          const min = parseFloat(result.referenceMin.toString());
          const max = parseFloat(result.referenceMax.toString());
          
          let score = 0;
          if (value >= min && value <= max) {
            score = 85 + Math.random() * 15; // 85-100 for normal range
          } else if (value < min || value > max) {
            const deviation = Math.abs(value - (min + max) / 2) / ((max - min) / 2);
            score = Math.max(20, 80 - (deviation * 30)); // Decrease based on deviation
          }

          categoryScores[config.category as keyof typeof categoryScores] += score * config.weight;
        }
      }
    }

    // Calculate overall score
    const overallScore = Math.round(
      (categoryScores.cardiovascular + categoryScores.metabolic + categoryScores.vitamin) / 3
    );

    const healthScore = await storage.createHealthScore({
      userId,
      overallScore: overallScore || 75, // Default score if no data
      cardiovascularScore: Math.round(categoryScores.cardiovascular) || 75,
      metabolicScore: Math.round(categoryScores.metabolic) || 75,
      vitaminScore: Math.round(categoryScores.vitamin) || 75,
    });

    // Generate AI insights if score is concerning
    if (overallScore < 70) {
      await storage.createAiInsight({
        userId,
        title: "Health Score Alert",
        content: `Your overall health score is ${overallScore}. Consider reviewing your recent lab results and consulting with a healthcare professional.`,
        category: "warning",
        priority: "high",
      });
    }

    return healthScore;
  } catch (error) {
    console.error('Error calculating health score:', error);
    throw error;
  }
}
