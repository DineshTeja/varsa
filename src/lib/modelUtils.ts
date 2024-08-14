import { OpenAIModel } from './types/model';
import { AiOutlineOpenAI } from "react-icons/ai";
import { SiGooglegemini, SiAnthropic, SiPerplexity } from "react-icons/si";
import { IconType } from 'react-icons';
import { MistralIcon} from './icons/mistral';
import { TogetherIcon } from './icons/together';
import { CohereIcon } from './icons/cohere';
import { GroqIcon } from './icons/groq';

export interface ModelWithIcon extends OpenAIModel {
  icon: IconType;
  provider: string;
}

export const availableModels: ModelWithIcon[] = [
  { id: 'gpt-4o', name: 'GPT-4o', icon: AiOutlineOpenAI, provider: 'openai'},
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', icon: AiOutlineOpenAI, provider: 'openai'},
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', icon: AiOutlineOpenAI, provider: 'openai'},
  { id: 'gpt-4', name: 'GPT-4', icon: AiOutlineOpenAI, provider: 'openai'},
  { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', icon: SiAnthropic, provider: 'anthropic'},
  { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', icon: SiAnthropic, provider: 'anthropic'},
  { id: 'open-mistral-7b', name: 'Mistral 7B', provider: 'mistral', icon: MistralIcon },
  { id: 'open-mistral-8x7b', name: 'Mistral 8x7B', provider: 'mistral', icon: MistralIcon },
  { id: 'mistral-tiny', name: 'Mistral Tiny', provider: 'mistral', icon: MistralIcon },
  { id: 'mistral-small', name: 'Mistral Small', provider: 'mistral', icon: MistralIcon },
  { id: 'mistral-medium', name: 'Mistral Medium', provider: 'mistral', icon: MistralIcon },
  { id: 'llama-3.1-sonar-small-128k-chat', name: '(Perplexity) Llama 3.1 Sonar Small 128K Chat', provider: 'perplexity', icon: SiPerplexity },
  { id: 'llama-3.1-sonar-large-128k-chat', name: '(Perplexity) Llama 3.1 Sonar Large 128K Chat', provider: 'perplexity', icon: SiPerplexity },
  { id: 'llama-3.1-405b-reasoning', name: '(Groq) Llama 3.1 405B (Preview)', provider: 'groq', icon: GroqIcon },
  { id: 'llama-3.1-70b-versatile', name: '(Groq) Llama 3.1 70B (Preview)', provider: 'groq', icon: GroqIcon },
  { id:  'llama3-70b-8192', name: '(Groq) Llama 3.1 70B 8192', provider: 'groq', icon: GroqIcon },
  { id: 'mixtral-8x7b-32768', name: '(Groq) Mixtral 8x7B', provider: 'groq', icon: GroqIcon },
  { id: 'llama2-70b-4096', name: '(Groq) LLaMA2 70B', provider: 'groq', icon: GroqIcon },
  { id: 'command-r-plus', name: '(Cohere) Command R Plus', provider: 'cohere', icon: CohereIcon },
  { id: 'gemini-1.5-flash-001', name: '(Google) Gemini 1.5 Flash', provider: 'google', icon: SiGooglegemini },
  { id: 'gemini-1.5-pro-001', name: '(Google) Gemini 1.5 Pro', provider: 'google', icon: SiGooglegemini },
  { id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', name: '(Together) Llama 3.1 70B Instruct Turbo', provider: 'together', icon: TogetherIcon },
  { id: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo', name: '(Together) Llama 3.1 8B Turbo', provider: 'together', icon: TogetherIcon },
  { id: 'meta-llama/Meta-Llama-3-8B-Instruct-Lite', name: '(Together) Llama 3.1 8B Lite', provider: 'together', icon: TogetherIcon },
  { id: 'togethercomputer/Llama-2-7B-32K-Instruct', name: '(Together) Llama 2 7B 32K Instruct', provider: 'together', icon: TogetherIcon },
  { id: 'cognitivecomputations/dolphin-2.5-mixtral-8x7b', name: '(Together) Dolphin 2.5 Mixtral 8x7B', provider: 'together', icon: TogetherIcon },
  { id: 'databricks/dbrx-instruct', name: '(Together) DBRx Instruct', provider: 'together', icon: TogetherIcon },
  { id: 'deepseek-ai/deepseek-coder-33b-instruct', name: '(Together) DeepSeek Coder 33B Instruct', provider: 'together', icon: TogetherIcon },
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
};