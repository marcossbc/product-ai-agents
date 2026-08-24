import { createNetwork, createRoutingAgent, openai } from "@inngest/agent-kit";
import { moderatorAgent, priceScoutAgent, sentimentAnalyzerAgent, webpageAgent } from "./agent";
import { doneTool, routeToAgentTool } from "./tools/router";

const superVisorAgent = createRoutingAgent({
  name: "supervisor",
  description: "AI supervisor that orchestrates the news analysis workflow",
  
  system: ({ network }) => {
    const state = network?.state.data || {};
    console.log("🔍 [Supervisor] Current state:", state);

    const agents = Array.from(network?.agents.values() || []);

    return `You are an intelligent supervisor managing a news analysis workflow.

**Current State:**
- results found: ${state.results?.length || 0}  
- Pages scraped: ${state.pages?.length || 0}
- Sentiments analyzed: ${state.sentiments?.length || 0}  
- Moderation approval: ${state.approval?.approved ?? "pending"}

**Available Agents:**
${agents.map(a => `- ${a.name}: ${a.description}`).join('\n')}  

**Your Job:**
1. Analyze the current state  
2. Decide which agent should run next to progress the workflow 
3. Use route_to_agent tool to select the next agent 
4. Use done tool when all steps are complete and content is approved  

**Workflow Logic:**
- If no results → route to "price-scout"  
- If results but pages not scraped → route to "webpage-agent"  
- If pages scraped but sentiments not analyzed → route to "sentiment-analyzer"  
- If sentiments analyzed but not approved → route to "moderator-agent"  
- If approved → call done
`;
  },

  model: openai({ model: "gpt-5-mini" }),
  tools: [routeToAgentTool, doneTool],
  tool_choice: "auto",

  lifecycle: {
    onRoute: ({ result, network }) => {
      if (!result.toolCalls || result.toolCalls.length === 0) return undefined;

      const tool = result.toolCalls[0];

      if (tool.tool.name === "done") return undefined;

      if (tool.tool.name === "route_to_agent") {
        const agentName = (tool.content as any)?.data || (tool.content as string);
        return [agentName];
      }

      return undefined;
    },
  },
});

export const priceAnalysisNetwork = createNetwork({
  name: "news_analysis_workflow",
  description: "Multi-agent system for news analysis, sentiment analysis, and moderation",
  agents: [
    priceScoutAgent,
    webpageAgent,
    sentimentAnalyzerAgent,
    moderatorAgent
  ],
  router: superVisorAgent,
  maxIter: 20
});