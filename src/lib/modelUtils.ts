import { OpenAIModel } from './types/model';
import { AiOutlineOpenAI } from "react-icons/ai";
import { SiGooglegemini, SiAnthropic, SiPerplexity } from "react-icons/si";
import { FaRegHandshake, FaGoogle } from "react-icons/fa";
import { CiSquareQuestion } from "react-icons/ci";
import { IconType } from 'react-icons';

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
  { id: 'gemini-pro', name: 'Gemini Pro', icon: SiGooglegemini, provider: 'google'},
];

export const providerIcons: { [key: string]: { icon: IconType; displayName: string } } = {
  openai: { icon: AiOutlineOpenAI, displayName: 'OpenAI' },
  anthropic: { icon: SiAnthropic, displayName: 'Anthropic' },
  groq: { icon: CiSquareQuestion, displayName: 'Groq' },
  perplexity: { icon: SiPerplexity, displayName: 'Perplexity' },
  together: { icon: FaRegHandshake, displayName: 'Together' },
  mistral: { icon: CiSquareQuestion, displayName: 'Mistral' },
  cohere: { icon: CiSquareQuestion, displayName: 'Cohere' },
  google: { icon: FaGoogle, displayName: 'Google' },
};