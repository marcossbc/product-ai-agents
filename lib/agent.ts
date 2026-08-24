import { createAgent, openai } from "@inngest/agent-kit";
import { serperSearchTool } from "./tools/serperSearchTool";
import { webpageScrapeTool } from "./tools/webpagetool";
import { approveContentTool, saveSentimentsTool } from "./tools/saveSentimentsTool";

export const priceScoutAgent = createAgent({
  name: "price-scout",
  description: "AI agent that searches products and compares prices",

  system: `
You are a Price Scout AI Agent.

Your job:
- When user asks about ANY product, you MUST use the serper_search tool.
- Extract price information if available.
- Respond clearly and cleanly.

Focus on:
- Product name
- Price
- Website / Source
- Link
`,

  tools: [serperSearchTool],

  model: openai({ model: "gpt-5-mini" }),
});




export const webpageAgent = createAgent({
  name: "webpage-agent",

  description: "Analyzes webpages from search results",

  system: `
You are Webpage Analysis Agent.

Workflow:
- Use webpage_scraper
- Read scraped content
- Extract useful insights
- Summarize clearly
`,

  tools: [webpageScrapeTool],

  model: openai({
    model: "gpt-5-mini"
  })
});





export const sentimentAnalyzerAgent = createAgent({
  name: "sentiment-analyzer",
  description: "Analyzes the content of scraped webpages and stores sentiment analysis",

  system: ({ network }) => {
    
    const pages = network?.state.data.pages || [];

    console.log("Pages to analyze:", pages.length);

    return `
You are a sentiment analysis expert.

Analyze the following webpages:

${JSON.stringify(pages, null, 2)}

For each page, provide:
1) Sentiment (positive, negative, neutral)
2) Score (0 to 1)
3) Short reasoning

You MUST use the save_sentiments tool to store your analysis.
`;
  },

  tools: [saveSentimentsTool],

  tool_choice:"save_sentiments",


  model: openai({ model: "gpt-5-mini" }),
});




export const moderatorAgent = createAgent({
  name: "moderator-agent",
  description: "Orchestrates the workflow: search → scrape → sentiment analysis, monitors progress",

  system: ({ network }) => {
    
    const state = network?.state.data || {};
    const resultsCount = state.results?.length || 0;
    const pagesCount = state.pages?.length || 0;
    const sentimentsCount = state.sentiments?.length || 0;
    const progress = state.progress || {};

    return `
You are Moderator AI. Your job is to monitor the workflow:

- Search results found: ${resultsCount}
- Pages scraped: ${pagesCount}
- Sentiment analyses completed: ${sentimentsCount}
- Progress flags: ${JSON.stringify(progress)}

Tasks:
1) Check if each stage (search, scrape, sentiment) is completed.
2) If any stage failed, provide a clear error message and suggestion.
3) Provide a brief summary of findings if all stages are completed.
4) Advise on next steps if needed.
`;
  },

      tools: [approveContentTool],

  model: openai({ model: "gpt-5-mini" }),
});