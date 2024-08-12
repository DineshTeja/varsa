import { OpenAIModel } from './types/model';
import { AiOutlineOpenAI } from "react-icons/ai";
import { SiGooglegemini } from "react-icons/si";
import { SiAnthropic } from "react-icons/si";
import { IconType } from 'react-icons';

export interface ModelWithIcon extends OpenAIModel {
  icon: IconType;
  provider: string;
}

export const availableModels: ModelWithIcon[] = [
  { id: 'gpt-4o-turbo', name: 'GPT-4o Turbo', icon: AiOutlineOpenAI, provider: 'openai'},
  { id: 'gpt-4o', name: 'GPT-4o', icon: AiOutlineOpenAI, provider: 'openai'},
  { id: 'gpt-4', name: 'GPT-4', icon: AiOutlineOpenAI, provider: 'openai'},
  { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', icon: SiAnthropic, provider: 'anthropic'},
  { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', icon: SiAnthropic, provider: 'anthropic'},
  { id: 'gemini-pro', name: 'Gemini Pro', icon: SiGooglegemini, provider: 'google'},
];