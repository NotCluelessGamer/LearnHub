import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const userProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const completedLessons = userProgress.filter(p => p.completed).length;
    const totalLessons = await ctx.db.query("lessons").collect();
    
    return {
      completedLessons,
      totalLessons: totalLessons.length,
      completionRate: totalLessons.length > 0 ? Math.round((completedLessons / totalLessons.length) * 100) : 0,
    };
  },
});
