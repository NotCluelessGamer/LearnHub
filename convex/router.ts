import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

// Placeholder for AI feedback - to be connected later
http.route({
  path: "/api/feedback",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    // Placeholder for AI feedback integration
    const body = await req.json();
    
    return new Response(
      JSON.stringify({
        feedback: "Great work! This is a placeholder for AI feedback that will be connected later.",
        suggestions: ["Keep practicing!", "Try the next lesson when you're ready."]
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }),
});

export default http;
