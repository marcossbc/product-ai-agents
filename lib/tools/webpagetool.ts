import { createTool } from "@inngest/agent-kit";

export const webpageScrapeTool = createTool({
  name: "webpage_scraper",
  description: "Scrape webpages from previous search results and update database",

  handler: async (_, { network, step }) => {

    if (!step) {
      throw new Error("Step tools not available");
    }

    const results = network.state.data.results;

    if (!results || results.length === 0) {
      throw new Error("No search results found in network state");
    }

    const pages: any[] = [];

    for (const item of results.slice(0, 10)) {

      const scraped = await step.run(`scrape_${item.link}`, async () => {

        console.log("SCRAPING:", item.link);

        const res = await fetch("https://scrape.serper.dev", {
          method: "POST",
          headers: {
            "X-API-KEY": process.env.SERPER_API_KEY!,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: item.link })
        });

        if (!res.ok) {
          throw new Error("Scrape failed");
        }

        return res.json();
      });

      pages.push({
        title: item.title,
        link: item.link,
        content: scraped?.text || "No content"
      });
    }


    network.state.data.pages = pages;

    // ✅ Update MongoDB
    await step.run("save_pages_to_db", async () => {
      const { getDB } = await import("../db");
      const db = await getDB();
      const runId = network.state.data.runId;

      if (!runId) {
        console.error("No runId found in network state!");
        return;
      }

      const result = await db.collection("results").updateOne(
        { runId, status: "running" },
        {
          $set: {
            "state.pages": pages,
            "progress.webpageScrape": "completed",
            updatedAt: new Date(),
          },
        }
      );

      console.log("✅ Pages saved to DB:", {
        matched: result.matchedCount,
        modified: result.modifiedCount,
      });
    });

    return { success: true, pages };
  }
});