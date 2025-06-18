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
  tasks: jsonb("tasks").$type<Array<{ id: string; text: string; completed: boolean; dueDate?: string }>>().notNull(),
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  labResults: many(labResults),
  healthScores: many(healthScores),
  actionPlans: many(actionPlans),
  aiInsights: many(aiInsights),
  fileUploads: many(fileUploads),
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

export const fileUploadsRelations = relations(fileUploads, ({ one }) => ({
  user: one(users, {
    fields: [fileUploads.userId],
    references: [users.id],
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
export type LoginCredentials = z.infer<typeof loginSchema>;
