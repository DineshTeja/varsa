import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

const ApiKeyInput: React.FC = () => {
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
    groq: '',
    together: '',
    mistral: '',
    cohere: '',
    perplexity: '',
  });

  const handleApiKeyChange = (provider: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: value }));
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