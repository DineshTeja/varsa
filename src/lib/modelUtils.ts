import { OpenAIModel } from './types/model';
import { AiOutlineOpenAI } from "react-icons/ai";
import { SiGooglegemini, SiAnthropic, SiPerplexity} from "react-icons/si";
import { IconType } from 'react-icons';
import { MistralIcon} from './icons/mistral';
import { TogetherIcon } from './icons/together';
import { CohereIcon } from './icons/cohere';
import { GroqIcon } from './icons/groq';
import { HuggingFaceIcon } from './icons/huggingface';

export interface ModelWithIcon {
  id: string;
  name: string;
  icon: IconType;
  provider: string;
  cacheControl?: boolean;
  contextWindow: number;
  inputCostPerMillionTokens: number;
  outputCostPerMillionTokens: number;
  requestCost?: number;
}

export const availableModels: ModelWithIcon[] = [
  { id: 'gpt-4o', name: 'GPT-4o', icon: AiOutlineOpenAI, provider: 'openai', contextWindow: 128000, inputCostPerMillionTokens: 5, outputCostPerMillionTokens: 15 },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', icon: AiOutlineOpenAI, provider: 'openai', contextWindow: 128000, inputCostPerMillionTokens: 5, outputCostPerMillionTokens: 15 },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', icon: AiOutlineOpenAI, provider: 'openai', contextWindow: 128000, inputCostPerMillionTokens: 10, outputCostPerMillionTokens: 30 },
  { id: 'gpt-4', name: 'GPT-4 (Legacy Model)', icon: AiOutlineOpenAI, provider: 'openai', contextWindow: 8192, inputCostPerMillionTokens: 30, outputCostPerMillionTokens: 60 },
  { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet', icon: SiAnthropic, provider: 'anthropic', cacheControl: true, contextWindow: 200000, inputCostPerMillionTokens: 3, outputCostPerMillionTokens: 15 },
  { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', icon: SiAnthropic, provider: 'anthropic', contextWindow: 200000, inputCostPerMillionTokens: 15, outputCostPerMillionTokens: 75 },
  { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet (Legacy Model)', icon: SiAnthropic, provider: 'anthropic', contextWindow: 200000, inputCostPerMillionTokens: 3, outputCostPerMillionTokens: 15 },
  { id: 'open-mistral-7b', name: 'Mistral 7B', provider: 'mistral', icon: MistralIcon, contextWindow: 32768, inputCostPerMillionTokens: 0.25, outputCostPerMillionTokens: 0.25 },
  { id: 'open-mistral-8x7b', name: 'Mistral 8x7B', provider: 'mistral', icon: MistralIcon, contextWindow: 32768, inputCostPerMillionTokens: 0.7, outputCostPerMillionTokens: 0.7 },
  { id: 'mistral-tiny', name: 'Mistral Tiny', provider: 'mistral', icon: MistralIcon, contextWindow: 32768, inputCostPerMillionTokens: 2, outputCostPerMillionTokens: 6 },
  { id: 'mistral-small', name: 'Mistral Small', provider: 'mistral', icon: MistralIcon, contextWindow: 32768, inputCostPerMillionTokens: 2, outputCostPerMillionTokens: 6 },
  { id: 'mistral-medium', name: 'Mistral Medium', provider: 'mistral', icon: MistralIcon, contextWindow: 32768, inputCostPerMillionTokens: 2.7, outputCostPerMillionTokens: 8.1 },
  { id: 'llama-3.1-sonar-small-128k-chat', name: '(Perplexity) Llama 3.1 Sonar Small 128K Chat', provider: 'perplexity', icon: SiPerplexity, contextWindow: 28000, inputCostPerMillionTokens: 0.2, outputCostPerMillionTokens: 0.2, requestCost: 0.005 },
  { id: 'llama-3.1-sonar-large-128k-chat', name: '(Perplexity) Llama 3.1 Sonar Large 128K Chat', provider: 'perplexity', icon: SiPerplexity, contextWindow: 28000, inputCostPerMillionTokens: 0.6, outputCostPerMillionTokens: 0.6, requestCost: 0.005 },
  { id: 'llama-3.1-405b-reasoning', name: '(Groq) Llama 3.1 405B (Preview)', provider: 'groq', icon: GroqIcon, contextWindow: 8192, inputCostPerMillionTokens: 0.59, outputCostPerMillionTokens: 0.79 },
  { id: 'llama-3.1-70b-versatile', name: '(Groq) Llama 3.1 70B (Preview)', provider: 'groq', icon: GroqIcon, contextWindow: 8192, inputCostPerMillionTokens: 0.59, outputCostPerMillionTokens: 0.79 },
  { id: 'llama3-70b-8192', name: '(Groq) Llama 3.1 70B 8192', provider: 'groq', icon: GroqIcon, contextWindow: 8192, inputCostPerMillionTokens: 0.59, outputCostPerMillionTokens: 0.79 },
  { id: 'mixtral-8x7b-32768', name: '(Groq) Mixtral 8x7B', provider: 'groq', icon: GroqIcon, contextWindow: 32768, inputCostPerMillionTokens: 0.27, outputCostPerMillionTokens: 0.27 },
  { id: 'llama2-70b-4096', name: '(Groq) LLaMA2 70B', provider: 'groq', icon: GroqIcon, contextWindow: 4096, inputCostPerMillionTokens: 0.59, outputCostPerMillionTokens: 0.79 },
  { id: 'command-r-plus', name: '(Cohere) Command R Plus', provider: 'cohere', icon: CohereIcon, contextWindow: 128000, inputCostPerMillionTokens: 3, outputCostPerMillionTokens: 15 },
  { id: 'gemini-1.5-flash-001', name: '(Google) Gemini 1.5 Flash', provider: 'google', icon: SiGooglegemini, contextWindow: 30720, inputCostPerMillionTokens: 0, outputCostPerMillionTokens: 0 },
  { id: 'gemini-1.5-pro-001', name: '(Google) Gemini 1.5 Pro', provider: 'google', icon: SiGooglegemini, contextWindow: 30720, inputCostPerMillionTokens: 0, outputCostPerMillionTokens: 0 },
  { id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', name: '(Together) Llama 3.1 70B Instruct Turbo', provider: 'together', icon: TogetherIcon, contextWindow: 8000, inputCostPerMillionTokens: 0.9, outputCostPerMillionTokens: 0.9 },
  { id: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo', name: '(Together) Llama 3.1 8B Turbo', provider: 'together', icon: TogetherIcon, contextWindow: 8000, inputCostPerMillionTokens: 0.2, outputCostPerMillionTokens: 0.2 },
  { id: 'meta-llama/Meta-Llama-3-8B-Instruct-Lite', name: '(Together) Llama 3.1 8B Lite', provider: 'together', icon: TogetherIcon, contextWindow: 8000, inputCostPerMillionTokens: 0.2, outputCostPerMillionTokens: 0.2 },
  { id: 'togethercomputer/Llama-2-7B-32K-Instruct', name: '(Together) Llama 2 7B 32K Instruct', provider: 'together', icon: TogetherIcon, contextWindow: 32768, inputCostPerMillionTokens: 0.2, outputCostPerMillionTokens: 0.2 },
  { id: 'cognitivecomputations/dolphin-2.5-mixtral-8x7b', name: '(Together) Dolphin 2.5 Mixtral 8x7B', provider: 'together', icon: TogetherIcon, contextWindow: 32768, inputCostPerMillionTokens: 1.2, outputCostPerMillionTokens: 1.2 },
  { id: 'databricks/dbrx-instruct', name: '(Together) DBRx Instruct', provider: 'together', icon: TogetherIcon, contextWindow: 32000, inputCostPerMillionTokens: 1.2, outputCostPerMillionTokens: 1.2 },
  { id: 'deepseek-ai/deepseek-coder-33b-instruct', name: '(Together) DeepSeek Coder 33B Instruct', provider: 'together', icon: TogetherIcon, contextWindow: 8192, inputCostPerMillionTokens: 1.2, outputCostPerMillionTokens: 1.2 },
  { id: 'sarvam-2b', name: '(Hugging Face) Sarvam 2B-v0.5 Beta (Preview)', icon: HuggingFaceIcon, provider: 'huggingface-sarvam', contextWindow: 8192, inputCostPerMillionTokens: 0.1, outputCostPerMillionTokens: 0.1 },
];

export const providerIcons: { [key: string]: { icon: IconType; displayName: string } } = {
  openai: { icon: AiOutlineOpenAI, displayName: 'OpenAI' },
  anthropic: { icon: SiAnthropic, displayName: 'Anthropic' },
  groq: { icon: GroqIcon, displayName: 'Groq' },
  perplexity: { icon: SiPerplexity, displayName: 'Perplexity' },
  together: { icon: TogetherIcon, displayName: 'Together' },
  mistral: { icon: MistralIcon, displayName: 'Mistral' },
  cohere: { icon: CohereIcon, displayName: 'Cohere' },
  google: { icon: SiGooglegemini, displayName: 'Google Gemini' },
  "huggingface-sarvam": { icon: HuggingFaceIcon, displayName: 'Hugging Face' },
};

export const calculateCost = (model: ModelWithIcon, inputTokens: number, outputTokens: number): number => {
  const inputCost = (inputTokens / 1000000) * model.inputCostPerMillionTokens;
  const outputCost = (outputTokens / 1000000) * model.outputCostPerMillionTokens;
  const requestCost = model.requestCost || 0;
  return inputCost + outputCost + requestCost;
};