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
    const [isLoading, setIsLoading] = useState(false);

    const handleRun = async () => {
        setIsLoading(true);
        setResponse('');

        try {
        const res = await fetch('/api/generate', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            models: selectedModels,
            systemPrompt,
            userPrompt,
            }),
        });

        if (!res.ok) {
            throw new Error('Failed to generate response');
        }

        const data = await res.json();
        setResponse(data.response);
        } catch (error) {
        console.error('Error generating response:', error);
        setResponse('An error occurred while generating the response.');
        } finally {
        setIsLoading(false);
        }
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
        <Button onClick={handleRun} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Run'}
        </Button>
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