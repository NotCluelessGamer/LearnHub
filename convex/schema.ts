import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  categories: defineTable({
    name: v.string(),
    description: v.string(),
    icon: v.string(),
    color: v.string(),
  }),
  
  courses: defineTable({
    categoryId: v.id("categories"),
    title: v.string(),
    description: v.string(),
    difficulty: v.string(), // "Beginner", "Intermediate", "Advanced"
    estimatedHours: v.number(),
  }).index("by_category", ["categoryId"]),
  
  lessons: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    description: v.string(),
    content: v.string(),
    task: v.string(),
    order: v.number(),
  }).index("by_course", ["courseId"]),
  
  userProgress: defineTable({
    userId: v.id("users"),
    lessonId: v.id("lessons"),
    completed: v.boolean(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_lesson", ["userId", "lessonId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
