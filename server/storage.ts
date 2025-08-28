import { 
  users, 
  labResults, 
  healthScores, 
  actionPlans, 
  aiInsights, 
  fileUploads,
  biomarkers,
  educationalContent,
  userEducationProgress,
  chatMessages,
  coachProfiles,
  deepAnalyses,
  coachingSessions,
  healthGoals,
  holisticPlans,
  wellnessChallenges,
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
  type Biomarker,
  type EducationalContent,
  type InsertEducationalContent,
  type UserEducationProgress,
  type InsertUserEducationProgress,
  type ChatMessage,
  type InsertChatMessage,
  type CoachProfile,
  type InsertCoachProfile,
  type DeepAnalysis,
  type InsertDeepAnalysis,
  type CoachingSession,
  type InsertCoachingSession,
  type HealthGoal,
  type InsertHealthGoal,
  type HolisticPlan,
  type InsertHolisticPlan,
  type WellnessChallenge,
  type InsertWellnessChallenge
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
  
  // Educational content methods
  getEducationalContent(category?: string): Promise<EducationalContent[]>;
  getEducationalContentById(id: number): Promise<EducationalContent | undefined>;
  createEducationalContent(insertEducationalContent: InsertEducationalContent): Promise<EducationalContent>;
  
  // User education progress methods
  getUserEducationProgress(userId: number): Promise<UserEducationProgress[]>;
  updateUserEducationProgress(userId: number, contentId: number, progress: number, completed?: boolean): Promise<UserEducationProgress>;
  
  // Chat messages methods
  getChatMessages(userId: number, sessionId?: string): Promise<ChatMessage[]>;
  createChatMessage(insertChatMessage: InsertChatMessage): Promise<ChatMessage>;
  
  // Coach profiles methods
  getCoachProfiles(available?: boolean): Promise<CoachProfile[]>;
  getCoachProfile(id: number): Promise<CoachProfile | undefined>;
  createCoachProfile(insertCoachProfile: InsertCoachProfile): Promise<CoachProfile>;
  
  // Deep analyses methods
  getDeepAnalyses(userId: number): Promise<DeepAnalysis[]>;
  getDeepAnalysis(id: number): Promise<DeepAnalysis | undefined>;
  createDeepAnalysis(insertDeepAnalysis: InsertDeepAnalysis): Promise<DeepAnalysis>;
  
  // Coaching sessions methods
  getCoachingSessions(userId: number): Promise<CoachingSession[]>;
  createCoachingSession(insertCoachingSession: InsertCoachingSession): Promise<CoachingSession>;
  updateCoachingSession(id: number, updates: Partial<CoachingSession>): Promise<CoachingSession>;
  
  // Health goals methods
  getHealthGoals(userId: number): Promise<HealthGoal[]>;
  createHealthGoal(insertHealthGoal: InsertHealthGoal): Promise<HealthGoal>;
  updateHealthGoal(id: number, updates: Partial<HealthGoal>): Promise<HealthGoal>;
  
  // Holistic plans methods
  getHolisticPlans(userId: number): Promise<HolisticPlan[]>;
  createHolisticPlan(insertHolisticPlan: InsertHolisticPlan): Promise<HolisticPlan>;
  updateHolisticPlan(id: number, updates: Partial<HolisticPlan>): Promise<HolisticPlan>;
  
  // Wellness challenges methods
  getWellnessChallenges(userId?: number): Promise<WellnessChallenge[]>;
  createWellnessChallenge(insertWellnessChallenge: InsertWellnessChallenge): Promise<WellnessChallenge>;
  updateWellnessChallenge(id: number, updates: Partial<WellnessChallenge>): Promise<WellnessChallenge>;
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

  // Educational content methods
  async getEducationalContent(category?: string): Promise<EducationalContent[]> {
    if (category) {
      return await db.select().from(educationalContent)
        .where(eq(educationalContent.category, category))
        .orderBy(desc(educationalContent.publishedAt));
    }
    return await db.select().from(educationalContent)
      .orderBy(desc(educationalContent.publishedAt));
  }

  async getEducationalContentById(id: number): Promise<EducationalContent | undefined> {
    const [content] = await db.select().from(educationalContent)
      .where(eq(educationalContent.id, id));
    return content || undefined;
  }

  async createEducationalContent(insertEducationalContent: InsertEducationalContent): Promise<EducationalContent> {
    const [content] = await db
      .insert(educationalContent)
      .values(insertEducationalContent)
      .returning();
    return content;
  }

  // User education progress methods
  async getUserEducationProgress(userId: number): Promise<UserEducationProgress[]> {
    return await db.select().from(userEducationProgress)
      .where(eq(userEducationProgress.userId, userId))
      .orderBy(desc(userEducationProgress.createdAt));
  }

  async updateUserEducationProgress(userId: number, contentId: number, progress: number, completed?: boolean): Promise<UserEducationProgress> {
    // Check if progress record exists
    const [existingProgress] = await db.select().from(userEducationProgress)
      .where(and(
        eq(userEducationProgress.userId, userId),
        eq(userEducationProgress.contentId, contentId)
      ));

    if (existingProgress) {
      // Update existing record
      const [updated] = await db.update(userEducationProgress)
        .set({ 
          progress, 
          completed: completed ?? (progress >= 100),
          completedAt: completed || progress >= 100 ? new Date() : null
        })
        .where(eq(userEducationProgress.id, existingProgress.id))
        .returning();
      return updated;
    } else {
      // Create new record
      const [created] = await db.insert(userEducationProgress)
        .values({
          userId,
          contentId,
          progress,
          completed: completed ?? (progress >= 100),
          completedAt: completed || progress >= 100 ? new Date() : null
        })
        .returning();
      return created;
    }
  }

  // Chat messages methods
  async getChatMessages(userId: number, sessionId?: string): Promise<ChatMessage[]> {
    const conditions = [eq(chatMessages.userId, userId)];
    if (sessionId) {
      conditions.push(eq(chatMessages.sessionId, sessionId));
    }
    
    return await db.select().from(chatMessages)
      .where(and(...conditions))
      .orderBy(chatMessages.createdAt);
  }

  async createChatMessage(insertChatMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values(insertChatMessage)
      .returning();
    return message;
  }

  // Coach profiles methods
  async getCoachProfiles(available?: boolean): Promise<CoachProfile[]> {
    if (available !== undefined) {
      return await db.select().from(coachProfiles)
        .where(eq(coachProfiles.available, available))
        .orderBy(desc(coachProfiles.rating));
    }
    return await db.select().from(coachProfiles)
      .orderBy(desc(coachProfiles.rating));
  }

  async getCoachProfile(id: number): Promise<CoachProfile | undefined> {
    const [coach] = await db.select().from(coachProfiles)
      .where(eq(coachProfiles.id, id));
    return coach || undefined;
  }

  async createCoachProfile(insertCoachProfile: InsertCoachProfile): Promise<CoachProfile> {
    const [coach] = await db
      .insert(coachProfiles)
      .values(insertCoachProfile)
      .returning();
    return coach;
  }

  // Deep analyses methods
  async getDeepAnalyses(userId: number): Promise<DeepAnalysis[]> {
    return await db.select().from(deepAnalyses)
      .where(eq(deepAnalyses.userId, userId))
      .orderBy(desc(deepAnalyses.generatedAt));
  }

  async getDeepAnalysis(id: number): Promise<DeepAnalysis | undefined> {
    const [analysis] = await db.select().from(deepAnalyses)
      .where(eq(deepAnalyses.id, id));
    return analysis || undefined;
  }

  async createDeepAnalysis(insertDeepAnalysis: InsertDeepAnalysis): Promise<DeepAnalysis> {
    const [analysis] = await db
      .insert(deepAnalyses)
      .values(insertDeepAnalysis)
      .returning();
    return analysis;
  }

  // Coaching sessions methods
  async getCoachingSessions(userId: number): Promise<CoachingSession[]> {
    return await db.select().from(coachingSessions)
      .where(eq(coachingSessions.userId, userId))
      .orderBy(desc(coachingSessions.scheduledAt));
  }

  async createCoachingSession(insertCoachingSession: InsertCoachingSession): Promise<CoachingSession> {
    const [session] = await db
      .insert(coachingSessions)
      .values(insertCoachingSession)
      .returning();
    return session;
  }

  async updateCoachingSession(id: number, updates: Partial<CoachingSession>): Promise<CoachingSession> {
    const [updated] = await db.update(coachingSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(coachingSessions.id, id))
      .returning();
    return updated;
  }

  // Health goals methods
  async getHealthGoals(userId: number): Promise<HealthGoal[]> {
    return await db.select().from(healthGoals)
      .where(eq(healthGoals.userId, userId))
      .orderBy(desc(healthGoals.createdAt));
  }

  async createHealthGoal(insertHealthGoal: InsertHealthGoal): Promise<HealthGoal> {
    const [goal] = await db
      .insert(healthGoals)
      .values(insertHealthGoal)
      .returning();
    return goal;
  }

  async updateHealthGoal(id: number, updates: Partial<HealthGoal>): Promise<HealthGoal> {
    const [updated] = await db.update(healthGoals)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(healthGoals.id, id))
      .returning();
    return updated;
  }

  // Holistic plans methods
  async getHolisticPlans(userId: number): Promise<HolisticPlan[]> {
    return await db.select().from(holisticPlans)
      .where(eq(holisticPlans.userId, userId))
      .orderBy(desc(holisticPlans.createdAt));
  }

  async createHolisticPlan(insertHolisticPlan: InsertHolisticPlan): Promise<HolisticPlan> {
    const [plan] = await db
      .insert(holisticPlans)
      .values(insertHolisticPlan)
      .returning();
    return plan;
  }

  async updateHolisticPlan(id: number, updates: Partial<HolisticPlan>): Promise<HolisticPlan> {
    const [updated] = await db.update(holisticPlans)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(holisticPlans.id, id))
      .returning();
    return updated;
  }

  // Wellness challenges methods
  async getWellnessChallenges(userId?: number): Promise<WellnessChallenge[]> {
    if (userId) {
      return await db.select().from(wellnessChallenges)
        .where(eq(wellnessChallenges.userId, userId))
        .orderBy(desc(wellnessChallenges.createdAt));
    }
    return await db.select().from(wellnessChallenges)
      .orderBy(desc(wellnessChallenges.createdAt));
  }

  async createWellnessChallenge(insertWellnessChallenge: InsertWellnessChallenge): Promise<WellnessChallenge> {
    const [challenge] = await db
      .insert(wellnessChallenges)
      .values(insertWellnessChallenge)
      .returning();
    return challenge;
  }

  async updateWellnessChallenge(id: number, updates: Partial<WellnessChallenge>): Promise<WellnessChallenge> {
    const [updated] = await db.update(wellnessChallenges)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(wellnessChallenges.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();