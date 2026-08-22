
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

  model: openai({ model: "gpt-5-mini-2026" }),
});
