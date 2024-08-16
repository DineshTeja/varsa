import React, { useState, useEffect, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { providerIcons } from '@/lib/modelUtils';
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const [visibleKeys, setVisibleKeys] = useState<{ [key: string]: boolean }>(
    Object.keys(providerIcons).reduce((acc, provider) => {
      acc[provider] = false;
      return acc;
    }, {} as { [key: string]: boolean })
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

  const toggleVisibility = (provider: string) => {
    setVisibleKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  return (
    <div ref={ref} className="space-y-4 p-2" onPaste={handlePaste}>
      {Object.entries(providerIcons).map(([provider, { icon: Icon, displayName }]) => (
        <div key={provider} className="flex items-center">
          <Icon className="mr-2 h-5 w-5" />
          <div className="relative flex-grow">
            <Input
              placeholder={`${displayName}`}
              value={apiKeys[provider]}
              onChange={(e) => handleApiKeyChange(provider, e.target.value)}
              type={visibleKeys[provider] ? "text" : "password"}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => toggleVisibility(provider)}
            >
              {visibleKeys[provider] ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
});

ApiKeyInput.displayName = 'ApiKeyInput';

export default ApiKeyInput;