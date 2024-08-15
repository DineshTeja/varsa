import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { providerIcons } from '@/lib/modelUtils';
import { useToast } from "@/components/ui/use-toast"

interface ApiKeys {
  [key: string]: string;
}

interface ApiKeyInputProps {
  onApiKeysChange: (apiKeys: ApiKeys) => void;
}

export default function ApiKeyInput({ onApiKeysChange }: ApiKeyInputProps) {
  const { toast } = useToast()

  const [apiKeys, setApiKeys] = useState<ApiKeys>(
    Object.keys(providerIcons).reduce((acc, provider) => {
      acc[provider] = '';
      return acc;
    }, {} as ApiKeys)
  );

  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData('text');
      if (text) {
        e.preventDefault();
        const lines = text.split('\n');
        const newApiKeys = { ...apiKeys };
        let isValid = true;

        lines.forEach(line => {
          const [key, value] = line.split('=');
          if (key && value) {
            if (key.endsWith('_API_KEY')) {
              const provider = key.replace('_API_KEY', '').toLowerCase();
              if (provider in newApiKeys) {
                newApiKeys[provider] = value.trim().replace(/^["']|["']$/g, '');
              }
            } else {
              isValid = false;
            }
          }
        });

        if (!isValid) {
          toast({
            title: "Error",
            description: "Invalid environment file. All variables should be in the format ____API_KEY.",
            variant: "destructive",
          });
          return;
        }

        setApiKeys(newApiKeys);
        onApiKeysChange(newApiKeys);
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [apiKeys, onApiKeysChange]);

  const handleApiKeyChange = (provider: string, value: string) => {
    const newApiKeys = { ...apiKeys, [provider]: value };
    setApiKeys(newApiKeys);
    onApiKeysChange(newApiKeys);
  };

  return (
    <div className="space-y-4">
      {Object.entries(providerIcons).map(([provider, { icon: Icon, displayName }]) => (
        <div key={provider} className="flex items-center">
          <Icon className="mr-2 h-5 w-5" />
          <Input
            placeholder={`${displayName}`}
            value={apiKeys[provider]}
            onChange={(e) => handleApiKeyChange(provider, e.target.value)}
            type="password"
            className="flex-grow"
          />
        </div>
      ))}
    </div>
  );
};