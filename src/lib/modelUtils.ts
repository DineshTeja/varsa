import { OpenAIModel } from './types/model';
import { AiOutlineOpenAI } from "react-icons/ai";
import { SiGooglegemini } from "react-icons/si";
import { SiAnthropic } from "react-icons/si";
import { IconType } from 'react-icons';

export interface ModelWithIcon extends OpenAIModel {
  icon: IconType;
}

export const availableModels: ModelWithIcon[] = [
  { id: 'gpt-4o-turbo', name: 'GPT-4o Turbo', icon: AiOutlineOpenAI },
  { id: 'gpt-4o', name: 'GPT-4o', icon: AiOutlineOpenAI },
  { id: 'gpt-4', name: 'GPT-4', icon: AiOutlineOpenAI },
  { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', icon: SiAnthropic },
  { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', icon: SiAnthropic },
  { id: 'gemini-pro', name: 'Gemini Pro', icon: SiGooglegemini },
];