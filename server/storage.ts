import { 
  users, 
  labResults, 
  healthScores, 
  actionPlans, 
  aiInsights, 
  fileUploads,
  biomarkers,
  type User, 
  type InsertUser,
  type LabResult,
  type InsertLabResult,
  type HealthScore,
  type InsertHealthScore,
  type ActionPlan,
  type InsertActionPlan,
  type AiInsight,
  type InsertAiInsight,
  type FileUpload,
  type InsertFileUpload,
  type Biomarker
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // Lab results methods
  getLabResults(userId: number, limit?: number): Promise<LabResult[]>;
  getLabResultsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<LabResult[]>;
  createLabResult(insertLabResult: InsertLabResult): Promise<LabResult>;
  
  // Health scores methods
  getLatestHealthScore(userId: number): Promise<HealthScore | undefined>;
  getHealthScoreHistory(userId: number): Promise<HealthScore[]>;
  createHealthScore(insertHealthScore: InsertHealthScore): Promise<HealthScore>;
  
  // Action plans methods
  getActionPlans(userId: number, status?: string): Promise<ActionPlan[]>;
  getActionPlan(id: number): Promise<ActionPlan | undefined>;
  createActionPlan(insertActionPlan: InsertActionPlan): Promise<ActionPlan>;
  updateActionPlan(id: number, updates: Partial<ActionPlan>): Promise<ActionPlan>;
  
  // AI insights methods
  getAiInsights(userId: number): Promise<AiInsight[]>;
  createAiInsight(insertAiInsight: InsertAiInsight): Promise<AiInsight>;
  
  // File uploads methods
  createFileUpload(insertFileUpload: InsertFileUpload): Promise<FileUpload>;
  
  // Biomarkers methods
  getBiomarkers(): Promise<Biomarker[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getLabResults(userId: number, limit?: number): Promise<LabResult[]> {
    if (limit) {
      return await db.select().from(labResults)
        .where(eq(labResults.userId, userId))
        .orderBy(desc(labResults.testDate))
        .limit(limit);
    }
    
    return await db.select().from(labResults)
      .where(eq(labResults.userId, userId))
      .orderBy(desc(labResults.testDate));
  }

  async getLabResultsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<LabResult[]> {
    return await db.select().from(labResults)
      .where(
        and(
          eq(labResults.userId, userId),
          gte(labResults.testDate, startDate),
          lte(labResults.testDate, endDate)
        )
      )
      .orderBy(desc(labResults.testDate));
  }

  async createLabResult(insertLabResult: InsertLabResult): Promise<LabResult> {
    const [result] = await db
      .insert(labResults)
      .values(insertLabResult)
      .returning();
    return result;
  }

  async getLatestHealthScore(userId: number): Promise<HealthScore | undefined> {
    const [score] = await db.select().from(healthScores)
      .where(eq(healthScores.userId, userId))
      .orderBy(desc(healthScores.calculatedAt))
      .limit(1);
    return score || undefined;
  }

  async getHealthScoreHistory(userId: number): Promise<HealthScore[]> {
    return await db.select().from(healthScores)
      .where(eq(healthScores.userId, userId))
      .orderBy(desc(healthScores.calculatedAt));
  }

  async createHealthScore(insertHealthScore: InsertHealthScore): Promise<HealthScore> {
    const [score] = await db
      .insert(healthScores)
      .values(insertHealthScore)
      .returning();
    return score;
  }

  async getActionPlans(userId: number, status?: string): Promise<ActionPlan[]> {
    if (status) {
      return await db.select().from(actionPlans)
        .where(and(eq(actionPlans.userId, userId), eq(actionPlans.status, status)))
        .orderBy(desc(actionPlans.createdAt));
    }
    
    return await db.select().from(actionPlans)
      .where(eq(actionPlans.userId, userId))
      .orderBy(desc(actionPlans.createdAt));
  }

  async getActionPlan(id: number): Promise<ActionPlan | undefined> {
    const [plan] = await db.select().from(actionPlans).where(eq(actionPlans.id, id));
    return plan || undefined;
  }

  async createActionPlan(insertActionPlan: InsertActionPlan): Promise<ActionPlan> {
    const [plan] = await db
      .insert(actionPlans)
      .values(insertActionPlan)
      .returning();
    return plan;
  }

  async updateActionPlan(id: number, updates: Partial<ActionPlan>): Promise<ActionPlan> {
    const [plan] = await db
      .update(actionPlans)
      .set(updates)
      .where(eq(actionPlans.id, id))
      .returning();
    return plan;
  }

  async getAiInsights(userId: number): Promise<AiInsight[]> {
    return await db.select().from(aiInsights)
      .where(eq(aiInsights.userId, userId))
      .orderBy(desc(aiInsights.createdAt));
  }

  async createAiInsight(insertAiInsight: InsertAiInsight): Promise<AiInsight> {
    const [insight] = await db
      .insert(aiInsights)
      .values(insertAiInsight)
      .returning();
    return insight;
  }

  async createFileUpload(insertFileUpload: InsertFileUpload): Promise<FileUpload> {
    const [upload] = await db
      .insert(fileUploads)
      .values(insertFileUpload)
      .returning();
    return upload;
  }

  async getBiomarkers(): Promise<Biomarker[]> {
    return await db.select().from(biomarkers);
  }
}

export const storage = new DatabaseStorage();