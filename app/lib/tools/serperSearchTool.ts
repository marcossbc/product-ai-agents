import { createTool } from "@inngest/agent-kit";
import { z } from "zod";


export const serperSearchTool = createTool({
  name: "serper_search",
  description: "Search the web for products, prices, and shopping results",

  parameters: z.object({
    query: z.string().describe("Product or item to search for"),
  }),

  handler: async (input, { network, step }) => {
    console.log("SEARCH:", input.query);

    const response = await step?.run("serper_api_call", async () => {
      const res = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: input.query,
          page: 1,
        }),
      });

      if (!res.ok) {
        throw new Error(`Serper API error ${res.status}`);
      }

      return res.json();
    });

    if (!response) {
      throw new Error("No Serper response");
    }

    const results: any[] = [];

    if (response.organic) {
      response.organic.forEach((item: any) => {
        results.push({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          source: item.source,
        });
      });
    }

    network.state.data.results = results;

    await step?.run("save_to_db", async () => {
      const { getDB } = await import("../db");
      const db = await getDB();
      console.log("dbbbbbb",db)
      const runId = network.state.data.runId;

      if (!runId || results.length === 0) return;

      await db.collection("results").updateOne(
        { runId },
        {
          $set: {
            "state.results": results,
            updatedAt: new Date(),
          },
        }
      );
    });

    return { success: true, count: results.length };
  },
});