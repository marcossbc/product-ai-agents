import { createTool } from "@inngest/agent-kit";
import {z} from "zod";
export const saveSentimentsTool = createTool({
  name: "save_sentiments",
  description: "Save sentiment analysis to the database",

  parameters: z.object({
    sentiments: z.array(
      z.object({
        sentiment: z.enum(["positive", "negative", "neutral"]),
        score: z.number().min(0).max(1),
        reasoning: z.string(),
        title: z.string(), 
        link: z.string(),   
      })
    )
  }),

  handler: async (input, { network, step }) => {
    if (!step) throw new Error("Step tools not available");

    // Save in network state
    network.state.data.sentiments = input.sentiments;

    // DB update
    await step.run("save_to_db", async () => {
      const { getDB } = await import("../db");
      const db = await getDB();
      const runId = network.state.data.runId;

      if (!runId) return;

      await db.collection("results").updateOne(
        { runId, status: "running" },
        {
          $set: {
            "state.sentiments": input.sentiments,
            "progress.sentimentAnalyzer": "completed",
            updatedAt: new Date(),
          },
        }
      );
    });

    return { success: true, count: input.sentiments.length };
  },
});



export const approveContentTool = createTool({
  name: "approveContentTool",
  description: "Approve or flag content after moderation, and update database",

  parameters: z.object({
    approved: z.boolean().describe("Is the content approved? true/false"),
    feedback: z.string().describe("Moderator feedback, can be empty string"),
  }),

  handler: async (input, { network, step }) => {
    if (!step) throw new Error("Step tools not available");

    const runId = network.state.data.runId;
    if (!runId) {
      console.error("No runId found in network state!");
      return { success: false, message: "No runId" };
    }

    network.state.data.approval = {
      approved: input.approved,
      feedback: input.feedback || "", 
      updatedAt: new Date(),
    };

    // Update DB
    await step.run("save_approval_to_db", async () => {
      const { getDB } = await import("../db");
      const db = await getDB();

      const result = await db.collection("results").updateOne(
        { runId },
        {
          $set: {
            "state.approval": network.state.data.approval,
            "progress.moderation": "completed",
            updatedAt: new Date(),
          },
        }
      );

      console.log("✅ Approval saved to DB:", {
        matched: result.matchedCount,
        modified: result.modifiedCount,
      });
    });

    return { success: true };
  },
});