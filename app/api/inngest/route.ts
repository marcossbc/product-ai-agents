import { serve } from "inngest/next";
import { inngest } from "../../inngest/client";
import {priceAnalysisWorkflow} from "@/app/inngest/function";

// We'll add functions here as we create them

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [priceAnalysisWorkflow],
});