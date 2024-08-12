import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface ModelSelectorProps {
  selectedModels: string[];
  setSelectedModels: React.Dispatch<React.SetStateAction<string[]>>;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModels, setSelectedModels }) => {
  const models = [
    '(OpenAI) gpt-4o',
    '(Groq) llama3-70b-8192',
    '(OpenAI) gpt-4-0125-preview',
  ];

  const handleModelToggle = (model: string) => {
    setSelectedModels(prev =>
      prev.includes(model)
        ? prev.filter(m => m !== model)
        : [...prev, model]
    );
  };

  return (
    <div className="space-y-2">
      {models.map(model => (
        <div key={model} className="flex items-center space-x-2">
          <Checkbox
            id={model}
            checked={selectedModels.includes(model)}
            onCheckedChange={() => handleModelToggle(model)}
          />
          <label htmlFor={model} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {model}
          </label>
        </div>
      ))}
    </div>
  );
};

export default ModelSelector;