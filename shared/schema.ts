import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, varchar, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  age: integer("age"),
  gender: text("gender"),
  height: integer("height"), // in cm
  weight: decimal("weight", { precision: 5, scale: 2 }), // in kg
  role: text("role").notNull().default("patient"), // patient, healthcare_professional, admin
  subscriptionTier: text("subscription_tier").default("free"), // free, plus, professional
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lab results table
export const labResults = pgTable("lab_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  testName: text("test_name").notNull(),
  value: decimal("value", { precision: 10, scale: 3 }).notNull(),
  unit: text("unit").notNull(),
  referenceMin: decimal("reference_min", { precision: 10, scale: 3 }),
  referenceMax: decimal("reference_max", { precision: 10, scale: 3 }),
  testDate: timestamp("test_date").notNull(),
  notes: text("notes"),
  source: text("source").default("manual"), // manual, upload, api
  fileName: text("file_name"), // for uploaded files
  createdAt: timestamp("created_at").defaultNow(),
});

// Biomarkers reference table
export const biomarkers = pgTable("biomarkers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category").notNull(), // e.g., "cardiovascular", "metabolic", "vitamin"
  commonUnits: jsonb("common_units").$type<string[]>().notNull(),
  referenceRanges: jsonb("reference_ranges").$type<Record<string, { min: number; max: number }>>().notNull(),
  description: text("description"),
});

// Health scores table
export const healthScores = pgTable("health_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  overallScore: integer("overall_score").notNull(),
  cardiovascularScore: integer("cardiovascular_score"),
  metabolicScore: integer("metabolic_score"),
  vitaminScore: integer("vitamin_score"),
  calculatedAt: timestamp("calculated_at").defaultNow(),
});

// Action plans table
export const actionPlans = pgTable("action_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // "ai_generated", "doctor_validated", "manual"
  status: text("status").default("active"), // active, completed, paused
  tasks: jsonb("tasks").$type<Array<{
    id: string;
    title: string;
    category: "Diet" | "Supplement" | "Lifestyle" | "Activity" | "Test";
    completed: boolean;
    dueDate?: string;
    details: {
      // Diet details
      instruction?: string;
      total_macros?: {
        fats: number;
        carbs: number;
        protein: number;
      };
      // Supplement details
      dose?: string;
      // Lifestyle details
      value?: number;
      unit?: string;
      // Activity details
      sections?: Array<{
        section: string;
        sets: string;
        type: string;
        exercises: Array<{
          title: string;
          description: string;
          instruction: string;
          reps?: string;
          rest?: string;
          weight?: string;
          files?: Array<{
            type: string;
            title: string;
            content: {
              url: string;
              file_id: string;
            };
          }>;
          exercise_filters?: {
            type: string | string[];
            level: string;
            muscle: string | string[];
            equipment: string | string[];
            conditions?: string | string[];
          };
          exercise_location?: string[];
        }>;
      }>;
      activity_location?: string[];
      // Test details
      questions_count?: number;
      estimated_time?: string;
      // Common fields
      notes?: string;
    };
  }>>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI insights table
export const aiInsights = pgTable("ai_insights", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // "warning", "recommendation", "info"
  priority: text("priority").default("medium"), // high, medium, low
  relatedBiomarkers: jsonb("related_biomarkers").$type<string[]>(),
  acknowledged: boolean("acknowledged").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// File uploads table
export const fileUploads = pgTable("file_uploads", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  uploadPath: text("upload_path").notNull(),
  processed: boolean("processed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Holistic health plans with AI generation and doctor validation
export const holisticPlans = pgTable("holistic_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  aiGenerated: boolean("ai_generated").default(true),
  doctorValidated: boolean("doctor_validated").default(false),
  validatedBy: text("validated_by"),
  validationDate: timestamp("validation_date"),
  validationCost: decimal("validation_cost", { precision: 8, scale: 2 }).default("15.00"),
  category: text("category").notNull(),
  duration: text("duration"),
  goals: jsonb("goals").$type<string[]>().notNull(),
  recommendations: jsonb("recommendations").$type<{
    nutrition: string[];
    exercise: string[];
    lifestyle: string[];
    supplements?: string[];
    monitoring: string[];
  }>().notNull(),
  status: text("status").default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Health goals with progress tracking
export const healthGoals = pgTable("health_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  holisticPlanId: integer("holistic_plan_id").references(() => holisticPlans.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  description: text("description"),
  targetValue: decimal("target_value", { precision: 10, scale: 2 }),
  currentValue: decimal("current_value", { precision: 10, scale: 2 }).default("0"),
  unit: text("unit"),
  targetDate: timestamp("target_date"),
  category: text("category").notNull(),
  status: text("status").default("active"),
  progress: integer("progress").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Wellness challenges with gamification
export const wellnessChallenges = pgTable("wellness_challenges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  holisticPlanId: integer("holistic_plan_id").references(() => holisticPlans.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  duration: integer("duration").notNull(),
  tasks: jsonb("tasks").$type<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
    completedDate?: string;
  }[]>().notNull(),
  completionPercentage: integer("completion_percentage").default(0),
  points: integer("points").default(0),
  badge: text("badge"),
  status: text("status").default("active"),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Educational content table
export const educationalContent = pgTable("educational_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  tags: jsonb("tags").$type<string[]>().notNull(),
  readingTime: integer("reading_time").notNull(), // in minutes
  author: text("author"),
  publishedAt: timestamp("published_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User progress on educational content
export const userEducationProgress = pgTable("user_education_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  contentId: integer("content_id").notNull().references(() => educationalContent.id, { onDelete: 'cascade' }),
  completed: boolean("completed").default(false),
  saved: boolean("saved").default(false),
  progress: integer("progress").default(0), // percentage
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat messages table
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  sender: text("sender").notNull(), // 'user', 'copilot', 'coach'
  content: text("content").notNull(),
  messageType: text("message_type").default("text"), // 'text', 'booking', 'attachment'
  attachmentUrl: text("attachment_url"),
  sessionId: text("session_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Coach availability and profiles
export const coachProfiles = pgTable("coach_profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialization: text("specialization").notNull(),
  available: boolean("available").default(true),
  avatar: text("avatar"),
  bio: text("bio"),
  experience: text("experience"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  hourlyRate: decimal("hourly_rate", { precision: 8, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Deep analysis results
export const deepAnalyses = pgTable("deep_analyses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  analysisData: jsonb("analysis_data").$type<{
    phenotypicAge?: number;
    riskFactors: string[];
    recommendations: string[];
    scores: Record<string, number>;
    charts?: Record<string, any>;
  }>().notNull(),
  status: text("status").default("completed"), // 'processing', 'completed', 'failed'
  generatedAt: timestamp("generated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Coaching sessions
export const coachingSessions = pgTable("coaching_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  coachId: integer("coach_id").notNull().references(() => coachProfiles.id, { onDelete: 'cascade' }),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").default(60), // minutes
  status: text("status").default("scheduled"), // 'scheduled', 'completed', 'cancelled'
  notes: text("notes"),
  sessionType: text("session_type").default("consultation"), // 'consultation', 'follow-up', 'emergency'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  labResults: many(labResults),
  healthScores: many(healthScores),
  actionPlans: many(actionPlans),
  aiInsights: many(aiInsights),
  fileUploads: many(fileUploads),
  holisticPlans: many(holisticPlans),
  healthGoals: many(healthGoals),
  wellnessChallenges: many(wellnessChallenges),
  educationProgress: many(userEducationProgress),
  chatMessages: many(chatMessages),
  deepAnalyses: many(deepAnalyses),
  coachingSessions: many(coachingSessions),
}));

export const labResultsRelations = relations(labResults, ({ one }) => ({
  user: one(users, {
    fields: [labResults.userId],
    references: [users.id],
  }),
}));

export const healthScoresRelations = relations(healthScores, ({ one }) => ({
  user: one(users, {
    fields: [healthScores.userId],
    references: [users.id],
  }),
}));

export const actionPlansRelations = relations(actionPlans, ({ one }) => ({
  user: one(users, {
    fields: [actionPlans.userId],
    references: [users.id],
  }),
}));

export const aiInsightsRelations = relations(aiInsights, ({ one }) => ({
  user: one(users, {
    fields: [aiInsights.userId],
    references: [users.id],
  }),
}));

export const holisticPlansRelations = relations(holisticPlans, ({ one, many }) => ({
  user: one(users, {
    fields: [holisticPlans.userId],
    references: [users.id],
  }),
  goals: many(healthGoals),
  challenges: many(wellnessChallenges),
}));

export const healthGoalsRelations = relations(healthGoals, ({ one }) => ({
  user: one(users, {
    fields: [healthGoals.userId],
    references: [users.id],
  }),
  holisticPlan: one(holisticPlans, {
    fields: [healthGoals.holisticPlanId],
    references: [holisticPlans.id],
  }),
}));

export const wellnessChallengesRelations = relations(wellnessChallenges, ({ one }) => ({
  user: one(users, {
    fields: [wellnessChallenges.userId],
    references: [users.id],
  }),
  holisticPlan: one(holisticPlans, {
    fields: [wellnessChallenges.holisticPlanId],
    references: [holisticPlans.id],
  }),
}));

export const fileUploadsRelations = relations(fileUploads, ({ one }) => ({
  user: one(users, {
    fields: [fileUploads.userId],
    references: [users.id],
  }),
}));

export const userEducationProgressRelations = relations(userEducationProgress, ({ one }) => ({
  user: one(users, {
    fields: [userEducationProgress.userId],
    references: [users.id],
  }),
  content: one(educationalContent, {
    fields: [userEducationProgress.contentId],
    references: [educationalContent.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}));

export const deepAnalysesRelations = relations(deepAnalyses, ({ one }) => ({
  user: one(users, {
    fields: [deepAnalyses.userId],
    references: [users.id],
  }),
}));

export const coachingSessionsRelations = relations(coachingSessions, ({ one }) => ({
  user: one(users, {
    fields: [coachingSessions.userId],
    references: [users.id],
  }),
  coach: one(coachProfiles, {
    fields: [coachingSessions.coachId],
    references: [coachProfiles.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLabResultSchema = createInsertSchema(labResults).omit({
  id: true,
  createdAt: true,
});

export const insertActionPlanSchema = createInsertSchema(actionPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHealthScoreSchema = createInsertSchema(healthScores).omit({
  id: true,
  calculatedAt: true,
});

export const insertAiInsightSchema = createInsertSchema(aiInsights).omit({
  id: true,
  createdAt: true,
});

export const insertFileUploadSchema = createInsertSchema(fileUploads).omit({
  id: true,
  createdAt: true,
});

export const insertHolisticPlanSchema = createInsertSchema(holisticPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHealthGoalSchema = createInsertSchema(healthGoals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWellnessChallengeSchema = createInsertSchema(wellnessChallenges).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEducationalContentSchema = createInsertSchema(educationalContent).omit({
  id: true,
  publishedAt: true,
  updatedAt: true,
});

export const insertUserEducationProgressSchema = createInsertSchema(userEducationProgress).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertCoachProfileSchema = createInsertSchema(coachProfiles).omit({
  id: true,
  createdAt: true,
});

export const insertDeepAnalysisSchema = createInsertSchema(deepAnalyses).omit({
  id: true,
  generatedAt: true,
  createdAt: true,
});

export const insertCoachingSessionSchema = createInsertSchema(coachingSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LabResult = typeof labResults.$inferSelect;
export type InsertLabResult = z.infer<typeof insertLabResultSchema>;
export type ActionPlan = typeof actionPlans.$inferSelect;
export type InsertActionPlan = z.infer<typeof insertActionPlanSchema>;
export type HealthScore = typeof healthScores.$inferSelect;
export type InsertHealthScore = z.infer<typeof insertHealthScoreSchema>;
export type AiInsight = typeof aiInsights.$inferSelect;
export type InsertAiInsight = z.infer<typeof insertAiInsightSchema>;
export type FileUpload = typeof fileUploads.$inferSelect;
export type InsertFileUpload = z.infer<typeof insertFileUploadSchema>;
export type Biomarker = typeof biomarkers.$inferSelect;
export type HolisticPlan = typeof holisticPlans.$inferSelect;
export type InsertHolisticPlan = z.infer<typeof insertHolisticPlanSchema>;
export type HealthGoal = typeof healthGoals.$inferSelect;
export type InsertHealthGoal = z.infer<typeof insertHealthGoalSchema>;
export type WellnessChallenge = typeof wellnessChallenges.$inferSelect;
export type InsertWellnessChallenge = z.infer<typeof insertWellnessChallengeSchema>;
export type EducationalContent = typeof educationalContent.$inferSelect;
export type InsertEducationalContent = z.infer<typeof insertEducationalContentSchema>;
export type UserEducationProgress = typeof userEducationProgress.$inferSelect;
export type InsertUserEducationProgress = z.infer<typeof insertUserEducationProgressSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type CoachProfile = typeof coachProfiles.$inferSelect;
export type InsertCoachProfile = z.infer<typeof insertCoachProfileSchema>;
export type DeepAnalysis = typeof deepAnalyses.$inferSelect;
export type InsertDeepAnalysis = z.infer<typeof insertDeepAnalysisSchema>;
export type CoachingSession = typeof coachingSessions.$inferSelect;
export type InsertCoachingSession = z.infer<typeof insertCoachingSessionSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
