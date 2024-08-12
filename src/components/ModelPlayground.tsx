'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ApiKeyInput from '@/components/ApiKeyInput';
import ModelSelector from '@/components/ModelSelector';
import PromptInput from '@/components/PromptInput';
import { OpenAIModel } from '@/lib/types/model';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Minus } from "lucide-react";
import { availableModels } from '@/lib/modelUtils';
import { ModelWithIcon } from '@/lib/modelUtils';

interface ModelResponse {
  model: string;
  response: string;
}

const ModelPlayground: React.FC = () => {
    const [selectedModels, setSelectedModels] = useState<ModelWithIcon[]>([]);    
    const [systemPrompt, setSystemPrompt] = useState('You are a helpful assistant.');
    const [userPrompt, setUserPrompt] = useState('');
    const [responses, setResponses] = useState<ModelResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openCollapsibles, setOpenCollapsibles] = useState<{ [key: string]: boolean }>({});

    const handleRun = async () => {
        setIsLoading(true);
        setResponses([]);
      
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
          setResponses(data.responses);
        } catch (error) {
          console.error('Error generating response:', error);
          setResponses([{ model: 'Error', response: 'An error occurred while generating the response.' }]);
        } finally {
          setIsLoading(false);
        }
    };

    const toggleCollapsible = (modelId: string) => {
        setOpenCollapsibles(prev => ({
          ...prev,
          [modelId]: !prev[modelId]
        }));
    };

    return (
        <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Add API keys</h2>
                  <ApiKeyInput />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-4">Add prompt</h2>
                  <PromptInput
                    systemPrompt={systemPrompt}
                    setSystemPrompt={setSystemPrompt}
                    userPrompt={userPrompt}
                    setUserPrompt={setUserPrompt}
                  />
                </div>
              </div>
              <div className="mt-6">
                <Button onClick={handleRun} disabled={isLoading}>
                  {isLoading ? 'Generating...' : 'Run'}
                </Button>
              </div>
            </div>
            <div className="col-span-1">
              <h2 className="text-lg font-semibold mb-4">Select models</h2>
                <div className="w-full">
                    <ModelSelector
                    selectedModels={selectedModels}
                    setSelectedModels={setSelectedModels}
                    models={availableModels}
                    />
                </div>
                <div className="mt-4">
                    <h3 className="text-md font-semibold mb-2">Selected Models</h3>
                    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                        {selectedModels.map((model, index) => (
                        <Collapsible key={index} className="mb-4 pb-4 border-b last:border-b-0">
                            <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <model.icon className="mr-2 h-4 w-4" />
                                <h4 className="font-semibold">{model.name}</h4>
                            </div>
                            <div className="flex items-center">
                                <CollapsibleTrigger asChild onClick={() => toggleCollapsible(model.id)}>
                                    <Button variant="ghost" size="sm">
                                        {openCollapsibles[model.id] ? (
                                        <ChevronUp className="h-4 w-4" />
                                        ) : (
                                        <ChevronDown className="h-4 w-4" />
                                        )}
                                    </Button>
                                </CollapsibleTrigger>
                                <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedModels(prev => prev.filter(m => m.id !== model.id))}
                                className="hover:bg-red-100 text-red-500"
                                >
                                <Minus className="h-4 w-4" />
                                </Button>
                            </div>
                            </div>
                            <CollapsibleContent>
                            {responses.find(r => r.model === model.name) ? (
                                <pre className="whitespace-pre-wrap mt-2 text-sm">
                                {responses.find(r => r.model === model.name)?.response}
                                </pre>
                            ) : (
                                <p className="mt-2 text-sm text-gray-500">No response generated yet.</p>
                            )}
                            </CollapsibleContent>
                        </Collapsible>
                        ))}
                    </ScrollArea>
                </div>
            </div>
          </div>
        </div>
    );
};

export default ModelPlayground;