import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .order("asc")
      .collect();

    if (!userId) {
      return lessons.map(lesson => ({ ...lesson, completed: false }));
    }

    // Get user progress for these lessons
    const progressMap = new Map();
    const userProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    userProgress.forEach(progress => {
      progressMap.set(progress.lessonId, progress.completed);
    });

    return lessons.map(lesson => ({
      ...lesson,
      completed: progressMap.get(lesson._id) || false,
    }));
  },
});

export const get = query({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson) return null;

    let completed = false;
    if (userId) {
      const progress = await ctx.db
        .query("userProgress")
        .withIndex("by_user_lesson", (q) => 
          q.eq("userId", userId).eq("lessonId", args.lessonId)
        )
        .first();
      completed = progress?.completed || false;
    }

    const course = await ctx.db.get(lesson.courseId);
    return { ...lesson, completed, course };
  },
});

export const markComplete = mutation({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to mark lessons complete");
    }

    // Check if progress already exists
    const existing = await ctx.db
      .query("userProgress")
      .withIndex("by_user_lesson", (q) => 
        q.eq("userId", userId).eq("lessonId", args.lessonId)
      )
      .first();

    if (existing) {
      // Update existing progress
      await ctx.db.patch(existing._id, {
        completed: true,
        completedAt: Date.now(),
      });
    } else {
      // Create new progress record
      await ctx.db.insert("userProgress", {
        userId,
        lessonId: args.lessonId,
        completed: true,
        completedAt: Date.now(),
      });
    }
  },
});

export const markIncomplete = mutation({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to update progress");
    }

    const existing = await ctx.db
      .query("userProgress")
      .withIndex("by_user_lesson", (q) => 
        q.eq("userId", userId).eq("lessonId", args.lessonId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        completed: false,
        completedAt: undefined,
      });
    }
  },
});
