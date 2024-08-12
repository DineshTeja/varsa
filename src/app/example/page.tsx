'use client';

import { useState, useCallback } from 'react';
import { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandSeparator, CommandEmpty, CommandShortcut } from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import _ from 'lodash';
import Navbar from '@/components/ui/navbar';

import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react"

interface RelationResult {
  relation: string;
  description: string;
  pronunciation: string;
  literal_meaning?: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RelationResult | null>(null);

  const suggestions = [
    "What do I call my brother's wife's grandfather's son?",
    "How am I related to my mother's sister's daughter?",
    "What's the relation between me and my father's brother's son?",
    "What do I call my spouse's sister's husband?",
    "How am I related to my grandmother's sister's granddaughter?"
  ];

  const handleSubmit = useCallback(async () => {
    if (!description.trim()) return;
  
    setLoading(true);
    setShowSuggestions(false);
    setResult(null);
  
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const response = await fetch('/api/relation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });
  
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error fetching relation:', error);
    } finally {
      setLoading(false);
    }
  }, [description]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4 pt-40">
        <h1 className="text-2xl font-thin mb-1 text-green-800 subpixel-antialiased font-serif">వర్</h1>
        <h1 className="text-5xl font-thin mb-5 text-green-800 subpixel-antialiased font-serif">Varsa</h1>
        <div className="w-full text-center max-w-3xl">
          <p className="text-md mb-4 text-gray-600">This is a stupid project, I just never know what relation I have with a distant relative. I&apos;m also trying to evaluate multilingual capabilities of various American LLMs.</p>
        </div>
        <div className="w-full max-w-3xl">
          <Command className="w-full shadow-md border border-gray-200 rounded-xl mt-4">
            <CommandInput
              placeholder="What do I call my..."
              value={description}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              onInput={(e) => setDescription(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
            />
            {showSuggestions ? (
              <CommandList className="w-full mt-1 bg-white shadow-lg rounded-xl">
                <CommandEmpty>
                <p className="text-sm text-muted-foreground">
                  Click{" "}
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">Enter</span>
                  </kbd>
                </p>
                </CommandEmpty>
                <CommandGroup heading="Suggestions">
                  {suggestions.map((suggestion, index) => (
                    <CommandItem key={index} onSelect={() => setDescription(suggestion)}>
                      {suggestion}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            ) : null}
          </Command>
          <div className="w-full max-w-3xl text-center text-sm text-gray-500 mt-4">  
            <p className="text-sm text-muted-foreground">
              Click{" "}
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">Enter</span>
              </kbd>
            </p>
          </div>
          {loading ? (
            <div className="w-full space-y-2 mt-4">
              <Skeleton isLoading={loading} className="w-full h-10 bg-neutral-200 rounded-md" />
              <Skeleton isLoading={loading} className="w-full h-20 bg-neutral-200 rounded-md" />
            </div>
          ) : result ? (
            <div className="space-y-2 mt-4">
              <div className="p-4 bg-white shadow-md rounded-md">
                <h2 className="text-xl font-light font-serif text-green-800">{_.startCase(_.toLower(result.relation))}</h2>
                <p className="text-sm font-light text-gray-500 mt-2"><strong>Pronunciation:</strong> {result.pronunciation}</p>
                {result.literal_meaning && (
                  <p className="text-sm font-light text-gray-500"><strong>Literal meaning:</strong> {result.literal_meaning}</p>
                )}
              </div>
              <div className="p-4 bg-white shadow-md rounded-md min-h-20 max-h-60 overflow-y-auto">
                <p className="text-gray-600 font-extralight">{result.description}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}