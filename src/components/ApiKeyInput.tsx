import React, { useState, useEffect, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { providerIcons } from '@/lib/modelUtils';
import { useToast } from "@/components/ui/use-toast"

interface ApiKeys {
  [key: string]: string;
}

interface ApiKeyInputProps {
  onApiKeysChange: (apiKeys: ApiKeys) => void;
}

const ApiKeyInput = forwardRef<HTMLDivElement, ApiKeyInputProps>(({ onApiKeysChange }, ref) => {
  const { toast } = useToast()

  const [apiKeys, setApiKeys] = useState<ApiKeys>(
    Object.keys(providerIcons).reduce((acc, provider) => {
      acc[provider] = '';
      return acc;
    }, {} as ApiKeys)
  );

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const text = e.clipboardData.getData('text');
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

  const handleApiKeyChange = (provider: string, value: string) => {
    const newApiKeys = { ...apiKeys, [provider]: value };
    setApiKeys(newApiKeys);
    onApiKeysChange(newApiKeys);
  };

  return (
    <div ref={ref} className="space-y-4 p-2" onPaste={handlePaste}>
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
});

ApiKeyInput.displayName = 'ApiKeyInput';

export default ApiKeyInput;