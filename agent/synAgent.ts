import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { DynamicTool } from "@langchain/core/tools";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ethers } from "ethers";

/**
 * Syn-A Langchain Agent
 * 
 * This agent performs complex multi-hop yield analysis using language models,
 * checks real-time APYs across Mantle's DeFi native protocols,
 * and seamlessly executes transactions through the SynVault Smart Contract via Account Abstraction/EOA.
 */

// 1. Setup Ethers.js
const RPC_URL = process.env.MANTLE_RPC_URL || "https://rpc.sepolia.mantle.xyz";
const PRIVATE_KEY = process.env.AGENT_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const VAULT_ADDRESS = process.env.VAULT_ADDRESS || "0xYourSynVaultAddress";

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Simplified vault interface to construct tx calldata
const vaultAbi = ["function executeStrategy(address targetContract, uint256 value, bytes calldata data)"];
const vaultContract = new ethers.Contract(VAULT_ADDRESS, vaultAbi, wallet);

// 2. Setup AI Core Model
const llm = new ChatOpenAI({
  modelName: "gpt-4-turbo",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY || "sk-dummy-key"
});

// 3. Define the Toolkit for our Agent

// Tool A: Data fetching
const getYieldDataTool = new DynamicTool({
  name: "get_mantle_yield_rates",
  description: "Fetches current market APY percentages natively on the Mantle network. Returns a JSON string.",
  func: async () => {
    // Mocking an oracle/API call logic
    return JSON.stringify({
      mETH_Staking: 6.8,    // High confidence, native Layer 2 liquid staking
      INIT_Capital: 12.1,   // Medium risk lending
      Agni_Finance: 8.5     // AMM LP Yield
    });
  },
});

// Tool B: Smart Contract Executor
const executeYieldStrategyTool = new DynamicTool({
  name: "execute_yield_strategy",
  description: "Executes the optimal yield strategy on the SynVault via on-chain transaction. Input must be the name of the protocol to invest in.",
  func: async (protocolToInvest: string) => {
    console.log(`[Syn-A Agent] Preparing to route funds to: ${protocolToInvest}...`);
    
    // Dummy on-chain execution logic
    const dummyTargetAddr = "0x0000000000000000000000000000000000001337";
    const dummyCalldata = "0x";
    
    /* In a real environment, you'd do:
     * const tx = await vaultContract.executeStrategy(dummyTargetAddr, 0, dummyCalldata);
     * await tx.wait();
     */
    
    console.log(`[Syn-A Agent] Successfully executed yields via Vault. Target Protocol: ${protocolToInvest}`);
    return `Transaction successful. Deployed liquidity to ${protocolToInvest}.`;
  },
});

const tools = [getYieldDataTool, executeYieldStrategyTool];

// 4. Create proper prompt for ToolCallingAgent
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are Syn-A, an autonomous yield-optimizing AI agent for Mantle DeFi protocols. Your goal is to maximize user returns while maintaining safety. Retrieve yield rates when asked, select the highest APY, and execute a strategy transaction. Do not describe the execution, instead rely exclusively on your tools to complete it."],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

async function runStrategyLoop() {
  console.log("== Starting Syn-A Autonomous Agent ==");

  // 5. Initialize Agent
  const agent = await createToolCallingAgent({
    llm,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
  });

  // Example Prompt Execution
  const objective = "Analyze current Mantle yields. Identify the best protocol by APY, and deploy our liquidity into it automatically utilizing the execution tools.";
  console.log(`Objective: ${objective}\n`);

  try {
    const result = await agentExecutor.invoke({ input: objective });
    console.log("== Final Agent Report ==");
    console.log(result.output);
  } catch (error) {
    console.error("Agent execution failed: ", error);
  }
}

// Uncomment to run if credentials are valid:
// runStrategyLoop();
