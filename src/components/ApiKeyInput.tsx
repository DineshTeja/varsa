import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface ApiKeys {
  [key: string]: string;
}

interface ApiKeyInputProps {
  onApiKeysChange: (apiKeys: ApiKeys) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeysChange }) => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    openai: '',
    anthropic: '',
    groq: '',
    together: '',
    mistral: '',
    cohere: '',
    perplexity: '',
  });

  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData('text');
      if (text && text.includes('_API_KEY')) {
        e.preventDefault();
        const lines = text.split('\n');
        const newApiKeys = { ...apiKeys };
        lines.forEach(line => {
          const [key, value] = line.split('=');
          if (key && value && key.endsWith('_API_KEY')) {
            const provider = key.replace('_API_KEY', '').toLowerCase();
            newApiKeys[provider] = value.trim();
          }
        });
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
      {Object.entries(apiKeys).map(([provider, value]) => (
        <div key={provider}>
          <Input
            placeholder={`${provider.charAt(0).toUpperCase() + provider.slice(1)} API Key`}
            value={value}
            onChange={(e) => handleApiKeyChange(provider, e.target.value)}
            type="password"
          />
        </div>
      ))}
    </div>
  );
};

export default ApiKeyInput;