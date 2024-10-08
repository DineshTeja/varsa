'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ApiKeyInput from '@/components/ApiKeyInput';
import ModelSelector from '@/components/ModelSelector';
import PromptInput from '@/components/PromptInput';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Minus, Bot, Play, Undo2, Book, Album, Omega } from "lucide-react";
import { availableModels, ModelWithIcon, calculateCost } from '@/lib/modelUtils';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { getRandomBenchmarkItem, getBenchmarkInstructions } from '@/lib/benchmarkUtils';
import { Benchmark } from '@/lib/benchmarks';
import { HuggingFaceIcon } from '@/lib/icons/huggingface';

interface ModelResponse {
    model: string;
    response: string;
    responseTime: number;
    error?: boolean;
    cost: number;
}

interface ApiKeys {
    [key: string]: string;
  }

interface Message {
    role: string;
    content: string;
    isDefault?: boolean;
    attachments?: Array<{
      type: 'url' | 'pdf';
      content: string;
      extractedData?: {
        title: string;
        cleaned_text: string;
        type: string;
      };
    }>;
  }

  
const ModelPlayground: React.FC = () => {
    const { toast } = useToast();
    const [selectedModels, setSelectedModels] = useState<ModelWithIcon[]>([]);    
    const [responses, setResponses] = useState<ModelResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openCollapsibles, setOpenCollapsibles] = useState<{ [key: string]: boolean }>({});
    const [loadingModels, setLoadingModels] = useState<{ [key: string]: boolean }>({});
    const [apiKeys, setApiKeys] = useState<ApiKeys>({});
    const apiKeyColumnRef = useRef<HTMLDivElement>(null);

    const [currentBenchmark, setCurrentBenchmark] = useState<Benchmark | null>(null);
    const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
    const benchmarkQuestionRef = useRef<string | null>(null);

    const [cacheControl, setCacheControl] = useState<{ [key: string]: boolean }>({});

    const getInitialMessages = () => {
        const baseMessages = [
            { role: 'system', content: 'You are a helpful assistant.', isDefault: true },
            { role: 'system-language', content: 'You must produce responses in standard American English. Ensure the language, tone, and style are appropriate for this context.', isDefault: true },
            { role: 'user', content: '', isDefault: true },
        ];

        if (Object.values(cacheControl).some(value => value)) {
            baseMessages.splice(2, 0, {
                role: 'system-anthropic-cache',
                content: 'Here are a few attachments about birds that you should use as context/knowledge for this conversation.',
                isDefault: true
            });
        }

        return baseMessages;
    };

    const getEmptyMessages = () => {
        const baseMessages = [
            { role: 'system', content: '', isDefault: true },
            { role: 'system-language', content: '', isDefault: true },
            { role: 'user', content: '', isDefault: true },
        ];

        if (Object.values(cacheControl).some(value => value)) {
            baseMessages.splice(2, 0, {
                role: 'system-anthropic-cache',
                content: '',
                isDefault: true
            });
        }

        return baseMessages;
    };

    const [messages, setMessages] = useState<Message[]>(getInitialMessages);

    useEffect(() => {
        setMessages(prevMessages => {
            const systemMessages = prevMessages.filter(msg => msg.role.startsWith('system'));
            const nonSystemMessages = prevMessages.filter(msg => !msg.role.startsWith('system'));
            
            const updatedSystemMessages = [
                ...systemMessages.filter(msg => msg.role !== 'system-anthropic-cache'),
                ...(Object.values(cacheControl).some(value => value)
                    ? [{
                        role: 'system-anthropic-cache',
                        content: 'Here are a few attachments about birds that you should use as context/knowledge for this conversation.',
                        isDefault: true
                    }]
                    : [])
            ];

            return [...updatedSystemMessages, ...nonSystemMessages];
        });
    }, [cacheControl]);

    const handleApiKeysChange = (newApiKeys: ApiKeys) => {
        setApiKeys(newApiKeys);
    };

    const estimateTokens = (text: string): number => {
        return Math.ceil(text.length / 4);
      };

    useEffect(() => {
        if (currentBenchmark && benchmarkQuestionRef.current) {
          const systemMessage = messages.find(msg => msg.role === 'system');
          const userMessage = messages.find(msg => msg.role === 'user');
      
          if (
            systemMessage?.content !== getBenchmarkInstructions(currentBenchmark) ||
            userMessage?.content !== benchmarkQuestionRef.current
          ) {
            setCurrentBenchmark(null);
            setCorrectAnswer(null);
            benchmarkQuestionRef.current = null;
          }
        }
      }, [messages, currentBenchmark]);
    
      const handleSetBenchmark = (benchmark: Benchmark) => {
        const { prompt, answer } = getRandomBenchmarkItem(benchmark);
        const instructions = getBenchmarkInstructions(benchmark);
        
        setCurrentBenchmark(benchmark);
        setCorrectAnswer(answer);
        benchmarkQuestionRef.current = prompt;
        setMessages([
          { role: 'system', content: instructions, isDefault: true },
          { role: 'user', content: prompt, isDefault: true },
        ]);
      };

    const handleRun = async () => {
        setIsLoading(true);
        setResponses([]);
        
        const initialLoadingState = selectedModels.reduce((acc, model) => {
            acc[model.id] = true;
            return acc;
        }, {} as { [key: string]: boolean });
        setLoadingModels(initialLoadingState);
    
        if (selectedModels.length === 0) {
            toast({
                title: 'No models selected',
                description: 'Please select at least one model to run.',
                variant: 'destructive',
            });
            setIsLoading(false);
            setLoadingModels({});
            return;
        }
    
        const missingApiKeys = selectedModels.filter(model => !apiKeys[model.provider]);
        if (missingApiKeys.length > 0) {
            const missingProviders = Array.from(new Set(missingApiKeys.map(model => model.provider)));
            toast({
                title: 'Missing API key(s)',
                description: `Please provide API key(s) for: ${missingProviders.join(', ')}`,
                variant: 'destructive',
            });
            setIsLoading(false);
            setLoadingModels({});
            return;
        }
    
        if (!(messages.some(msg => msg.role === 'user') || messages.some(msg => msg.role === "system")) 
            || (messages.some(msg => msg.role === 'user' && msg.content === '') 
            || messages.some(msg => msg.role === 'system' && msg.content === ''))) {
            toast({
                title: 'Missing prompts',
                description: 'Please provide at least one user message.',
                variant: 'destructive',
            });
            setIsLoading(false);
            setLoadingModels({});
            return;
        }
    
        const lastUserMessage = messages[messages.length - 1];
        if (lastUserMessage.role !== 'user') {
            toast({
                title: 'Invalid message order',
                description: 'The last message must be from the user.',
                variant: 'destructive',
            });
            setIsLoading(false);
            setLoadingModels({});
            return;
        }
    
        if (lastUserMessage.content.length > 1000) {
            toast({
                title: 'Uh oh! User prompt too long.',
                description: 'Your last user message is too long. Please keep it under 1000 characters.',
                variant: 'destructive',
            });
            setIsLoading(false);
            setLoadingModels({});
            return;
        }

        const systemMessages = messages.filter(message => 
            message.role === 'system' || 
            message.role === 'system-language' || 
            message.role === 'system-anthropic-cache'
          );
          
        const totalSystemTokens = systemMessages.reduce((sum, message) => {
            let tokenCount = estimateTokens(message.content);
            
            if (message.attachments) {
              tokenCount += message.attachments.reduce((attachmentSum, attachment) => {
                return attachmentSum + estimateTokens(attachment.extractedData?.cleaned_text || attachment.content);
              }, 0);
            }
            
            return sum + tokenCount;
          }, 0);
    
        if (totalSystemTokens < 1024 && Object.values(cacheControl).some(value => value)) {
          toast({
            title: `Insufficient system message length for cache control usage (${totalSystemTokens}/1024 tokens)`,
            description: 'For models with cache control, system messages should add up to at least 1024 tokens (approximately 4096 characters).',
            variant: 'destructive',
          });
          setIsLoading(false);
          setLoadingModels({});
          return;
        }
    
        try {
            selectedModels.forEach(async (model) => {
                const startTime = Date.now();
                try {
                    let modelMessages = [...messages];
                    if (model.id === 'claude-3-5-sonnet-20240620' && cacheControl[model.id]) {
                        const systemAnthropicCacheMessage = modelMessages.find(msg => msg.role === 'system-anthropic-cache');
                        if (systemAnthropicCacheMessage && systemAnthropicCacheMessage.attachments) {
                            const attachmentsText = systemAnthropicCacheMessage.attachments
                                .map(att => `[Attachment: ${att.type}]\nTitle: ${att.extractedData?.title || 'N/A'}\nContent: ${att.extractedData?.cleaned_text || att.content}\n`)
                                .join('\n');
                            systemAnthropicCacheMessage.content += '\n\n' + attachmentsText;
                        }
                    }

                    console.log(modelMessages);

                    const res = await fetch(`/api/generate/generate-${model.provider}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            models: [{
                                ...model,
                                cacheControl: cacheControl[model.id] || false
                            }],
                            messages: modelMessages,
                            apiKey: apiKeys[model.provider],
                        }),
                    });
                    
                    if (!res.ok) {
                        const errorText = await res.text();
                        console.error(`Error response for ${model.name}:`, {
                            status: res.status,
                            statusText: res.statusText,
                            body: errorText
                        });
                        throw new Error(`Failed to generate response for ${model.name} [${res.status}] [${res.statusText}] [${errorText}]`);
                    }
                    
                    const data = await res.json();
                    const response = data.responses[0];
                    const inputTokens = estimateTokens(modelMessages.map(msg => msg.content).join(' '));
                    const outputTokens = estimateTokens(response.response);
                    const cost = calculateCost(model, inputTokens, outputTokens);

                    const newResponse = {
                        ...response,
                        responseTime: Date.now() - startTime,
                        error: false,
                        cost,
                    };

                    setResponses(prev => [...prev.filter(r => r.model !== model.name), newResponse]);
                    setLoadingModels(prev => ({ ...prev, [model.id]: false }));
                } catch (error) {
                    console.error(`Error generating response for ${model.name}:`, error);
                    const errorResponse = {
                        model: model.name,
                        response: `${String(error)}`,
                        responseTime: Date.now() - startTime,
                        error: true,
                        cost: 0,
                    };
                    setResponses(prev => [...prev.filter(r => r.model !== model.name), errorResponse]);
                    setLoadingModels(prev => ({ ...prev, [model.id]: false }));
                }
            });
        } catch (error) {
            console.error('Error generating response:', error);
            setResponses([{ model: 'Error', response: 'An error occurred while generating the response.', responseTime: 0, cost: 0 }]);
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

    const handleCacheControlToggle = (modelId: string) => {
        setCacheControl(prev => ({
          ...prev,
          [modelId]: !prev[modelId]
        }));
      };

    const isGenerating = Object.values(loadingModels).some(isLoading => isLoading);

    return (
        <div className="w-full h-[1100px] bg-white shadow-sm rounded-lg p-6 flex flex-col">
            <div className="grid grid-cols-5 gap-6 flex-grow overflow-hidden">
                <div className="col-span-1 max-h-[1100px] overflow-y-scroll" ref={apiKeyColumnRef}>
                    <h2 className="text-lg font-semibold mb-2">API Keys & Tokens</h2>
                    <h3 className="text-sm text-gray-500 mb-2">You can paste an <strong>.env file</strong> (just click on one of the fields and paste). These are not persisted anywhere, even on refresh!</h3>
                    <ApiKeyInput ref={apiKeyColumnRef} onApiKeysChange={handleApiKeysChange} />
                </div>
                <div className="col-span-5 lg:col-span-2 px-2 max-h-[1100px] overflow-y-auto">
                    <div className="flex flex-col h-full">
                        <div className="flex-grow">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
                                <h2 className="text-lg font-semibold mb-2 sm:mb-0">Prompts</h2>
                            </div>
                            <div className="flex flex-wrap gap-2 my-2">
                                    <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSetBenchmark('MMLU')}
                                    className="w-full sm:w-auto"
                                    >
                                    <Album className="mr-2 h-4 w-4" />
                                    MMLU
                                    </Button>
                                    <Button 
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSetBenchmark('AI2 ARC Challenge')}
                                    className="w-full sm:w-auto"
                                    >
                                    <HuggingFaceIcon className="mr-2 h-4 w-4" />
                                    AI2 ARC
                                    </Button>
                                    <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSetBenchmark('GSM8K')}
                                    className="w-full sm:w-auto"
                                    >
                                    <Omega className="mr-2 h-4 w-4" />
                                    GSM8K
                                    </Button>
                                    <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setMessages(getInitialMessages)}
                                    className="w-full sm:w-auto"
                                    >
                                    <Undo2 className="mr-2 h-4 w-4" />
                                    Default
                                    </Button>
                                    <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setMessages(getEmptyMessages)}
                                    className="w-full sm:w-auto"
                                    >
                                    <Book className="mr-2 h-4 w-4" />
                                    Clear
                                    </Button>
                            </div>
                            {currentBenchmark && (
                                <div className="my-2 px-3 py-2 bg-gray-100 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                    <span className="text-xs font-medium text-gray-600 mb-1 sm:mb-0">
                                    Benchmark: <span className="text-green-800 font-bold">{currentBenchmark}</span>
                                    </span>
                                    <span className="text-xs font-medium">
                                    Correct answer: <span className="text-green-800 font-bold">{correctAnswer}</span>
                                    </span>
                                </div>
                            )}
                            <PromptInput
                                messages={messages}
                                setMessages={setMessages}
                            />
                            <div className="w-full py-4">
                                <Button 
                                    className="bg-green-900 text-white hover:bg-green-800 border-green-800 text-sm w-full"
                                    onClick={handleRun} 
                                    disabled={isLoading || isGenerating}
                                >
                                    <Play className="mr-2 h-4 w-4" /> 
                                    {isLoading || isGenerating ? 'Running...' : 'Run'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-2 px-2 max-h-[1100px] overflow-y-scroll">
                    <h2 className="text-lg font-semibold mb-4">Models</h2>
                    <div className="w-full mb-4">
                        <ModelSelector
                            selectedModels={selectedModels}
                            setSelectedModels={setSelectedModels}
                            models={availableModels}
                            apiKeys={apiKeys}
                        />
                    </div>
                <div className="mt-4">
                    <h3 className="text-md font-semibold mb-2">Selected Models</h3>
                    <ScrollArea className="h-full min-h-[800px] w-full rounded-md border p-4">
                        {selectedModels.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 mt-20">
                                <Bot className="w-10 h-10 mb-4 stroke-current opacity-50" />
                                <p className="text-lg font-semibold mb-2">No models selected</p>
                                <p className="text-sm text-gray-400 text-center max-w-xs">
                                    Choose models from the selector above to compare their responses
                                </p>
                            </div>
                        ) : (
                            selectedModels.map((model, index) => (
                                <Collapsible key={index} className="mb-4 pb-4 border-b last:border-b-0">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <div className="flex items-center">
                                                <model.icon className="mr-2 h-4 w-4" />
                                                <h4 className="font-semibold">{model.name}</h4>
                                            </div>
                                            {model.provider === 'anthropic' && model.cacheControl && (
                                                <div className="flex items-center ml-6 mt-2">
                                                    <Switch
                                                        checked={cacheControl[model.id] || false}
                                                        onCheckedChange={() => handleCacheControlToggle(model.id)}
                                                    />
                                                    <span className="text-sm text-gray-500 ml-2">Cache Control</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center">
                                            {loadingModels[model.id] && (
                                                <svg className="animate-spin mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            )}
                                            {!loadingModels[model.id] && responses.find(r => r.model === model.name) && (
                                                <div className="flex items-center mr-2">
                                                    {responses.find(r => r.model === model.name)?.error ? (
                                                        <svg className="h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                    <span className="text-xs text-gray-500 ml-1">
                                                        {(responses.find(r => r.model === model.name)?.responseTime ?? 0) / 1000}s
                                                    </span>
                                                    <span className="text-xs font-medium text-blue-500 ml-2">
                                                        ${responses.find(r => r.model === model.name)?.cost.toFixed(6) ?? '0.000000'}
                                                    </span>
                                                </div>
                                            )}
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
                                            <pre className={`whitespace-pre-wrap mt-2 text-sm ${responses.find(r => r.model === model.name)?.error ? 'text-red-500' : ''}`}>
                                                {responses.find(r => r.model === model.name)?.response}
                                            </pre>
                                        ) : (
                                            <p className="mt-2 text-sm text-gray-500">No response generated yet.</p>
                                        )}
                                    </CollapsibleContent>
                                </Collapsible>
                            ))
                        )}
                    </ScrollArea>
                </div>
            </div>
          </div>
        </div>
    );
};

export default ModelPlayground;