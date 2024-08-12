import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface PromptInputProps {
  systemPrompt: string;
  setSystemPrompt: React.Dispatch<React.SetStateAction<string>>;
  userPrompt: string;
  setUserPrompt: React.Dispatch<React.SetStateAction<string>>;
}

const PromptInput: React.FC<PromptInputProps> = ({
  systemPrompt,
  setSystemPrompt,
  userPrompt,
  setUserPrompt,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="system-prompt" className="block text-sm font-medium text-gray-700 mb-1">
          System
        </label>
        <Textarea
          id="system-prompt"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="Enter system prompt"
          className="min-h-[100px]"
        />
      </div>
      <div>
        <label htmlFor="user-prompt" className="block text-sm font-medium text-gray-700 mb-1">
          User
        </label>
        <Textarea
          id="user-prompt"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Enter user prompt"
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};

export default PromptInput;