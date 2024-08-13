'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ApiKeyInput from '@/components/ApiKeyInput';
import ModelSelector from '@/components/ModelSelector';
import PromptInput from '@/components/PromptInput';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Minus } from "lucide-react";
import { availableModels, ModelWithIcon } from '@/lib/modelUtils';

interface ModelResponse {
    model: string;
    response: string;
    responseTime: number;
}

interface ApiKeys {
  [key: string]: string;
}

const ModelPlayground: React.FC = () => {
    const [selectedModels, setSelectedModels] = useState<ModelWithIcon[]>([]);    
    const [systemPrompt, setSystemPrompt] = useState('You are a helpful assistant.');
    const [userPrompt, setUserPrompt] = useState('');
    const [responses, setResponses] = useState<ModelResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openCollapsibles, setOpenCollapsibles] = useState<{ [key: string]: boolean }>({});
    const [loadingModels, setLoadingModels] = useState<{ [key: string]: boolean }>({});
    const [apiKeys, setApiKeys] = useState<ApiKeys>({});

    const handleApiKeysChange = (newApiKeys: ApiKeys) => {
        setApiKeys(newApiKeys);
    };

    const handleRun = async () => {
        setIsLoading(true);
        setResponses([]);
        
        const initialLoadingState = selectedModels.reduce((acc, model) => {
            acc[model.id] = true;
            return acc;
        }, {} as { [key: string]: boolean });
        setLoadingModels(initialLoadingState);
    
        try {
            const allResponses = await Promise.all(
                selectedModels.map(async (model) => {
                    const startTime = Date.now();
                    const res = await fetch(`/api/generate-${model.provider}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            models: [model],
                            systemPrompt,
                            userPrompt,
                            apiKey: apiKeys[model.provider],
                        }),
                    });
    
                    if (!res.ok) {
                        throw new Error(`Failed to generate response for ${model.name}`);
                    }
    
                    const data = await res.json();
                    const endTime = Date.now();
                    const response = data.responses[0];
                    return {
                        ...response,
                        responseTime: endTime - startTime,
                    };
                })
            );
    
            setResponses(allResponses);
            allResponses.forEach((response: ModelResponse) => {
                setLoadingModels(prev => ({ ...prev, [response.model]: false }));
            });
        } catch (error) {
            console.error('Error generating response:', error);
            setResponses([{ model: 'Error', response: 'An error occurred while generating the response.', responseTime: 0 }]);
        } finally {
            setIsLoading(false);
            setLoadingModels({});
        }
    };

    const toggleCollapsible = (modelId: string) => {
        setOpenCollapsibles(prev => ({
          ...prev,
          [modelId]: !prev[modelId]
        }));
    };

    return (
        <div className="w-full min-h-screen bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Add API keys</h2>
                  <h3 className="text-sm text-gray-500 mb-2">You can paste an .env file too!</h3>
                  <ApiKeyInput onApiKeysChange={handleApiKeysChange} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-4">Add prompt</h2>
                  <PromptInput
                    systemPrompt={systemPrompt}
                    setSystemPrompt={setSystemPrompt}
                    userPrompt={userPrompt}
                    setUserPrompt={setUserPrompt}
                  />
                  <div className="mt-6">
                    <Button className="w-full bg-green-900" onClick={handleRun} disabled={isLoading}>
                        {isLoading ? 'Generating...' : 'Run'}
                    </Button>
                 </div>
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <h2 className="text-lg font-semibold mb-4">Select models</h2>
                <div className="w-full">
                    <ModelSelector
                    selectedModels={selectedModels}
                    setSelectedModels={setSelectedModels}
                    models={availableModels}
                    apiKeys={apiKeys}
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
                                {loadingModels[model.id] && (
                                    <svg className="animate-spin ml-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {!loadingModels[model.id] && responses.find(r => r.model === model.name) && (
                                    <div className="flex items-center ml-2">
                                        <svg className="h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-xs text-gray-500 ml-1">
                                            {(responses.find(r => r.model === model.name)?.responseTime ?? 0) / 1000}s
                                        </span>
                                    </div>
                                )}
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
                                onClick={() => {
                                    setSelectedModels(prev => prev.filter(m => m.id !== model.id));
                                    setResponses(prev => prev.filter(r => r.model !== model.name));
                                    setLoadingModels(prev => {
                                      const newLoadingModels = { ...prev };
                                      delete newLoadingModels[model.id];
                                      return newLoadingModels;
                                    });
                                  }}
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