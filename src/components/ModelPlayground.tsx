'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import ApiKeyInput from '@/components/ApiKeyInput';
import ModelSelector from '@/components/ModelSelector';
import PromptInput from '@/components/PromptInput';

const ModelPlayground: React.FC = () => {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful assistant.');
  const [userPrompt, setUserPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleRun = () => {
    // Implement the logic to run the selected models
    console.log('Running models:', selectedModels);
    setResponse('Model response will appear here.');
  };

  return (
    <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <h2 className="text-lg font-semibold mb-4">Add API keys</h2>
          <ApiKeyInput />
        </div>
        <div className="col-span-1">
          <h2 className="text-lg font-semibold mb-4">Add prompt</h2>
          <PromptInput
            systemPrompt={systemPrompt}
            setSystemPrompt={setSystemPrompt}
            userPrompt={userPrompt}
            setUserPrompt={setUserPrompt}
          />
        </div>
        <div className="col-span-1">
          <h2 className="text-lg font-semibold mb-4">Select models</h2>
          <ModelSelector
            selectedModels={selectedModels}
            setSelectedModels={setSelectedModels}
          />
        </div>
      </div>
      <div className="mt-6">
        <Button onClick={handleRun}>Run</Button>
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Response</h2>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          <pre className="whitespace-pre-wrap">{response}</pre>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ModelPlayground;