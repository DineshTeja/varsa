import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { OpenAIModel } from '@/lib/types/model';
import { PlusCircle } from 'lucide-react';
import { ModelWithIcon } from '@/lib/modelUtils';

interface ModelSelectorProps {
    selectedModels: ModelWithIcon[];
    setSelectedModels: React.Dispatch<React.SetStateAction<ModelWithIcon[]>>;
    models: ModelWithIcon[];
    apiKeys: { [key: string]: string };
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModels, setSelectedModels, models, apiKeys }) => {
    const handleModelSelect = (model: ModelWithIcon) => {
      if (!selectedModels.some(m => m.id === model.id)) {
        setSelectedModels(prev => [...prev, model]);
      }
    };
  
    return (
      <div className="w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add model for evaluation
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-[500px] overflow-y-scroll w-[--radix-dropdown-menu-trigger-width]">
            {models.map(model => {
              const isDisabled = !apiKeys[model.provider] || selectedModels.some(m => m.id === model.id);
              return (
                <DropdownMenuItem
                  key={model.id}
                  onSelect={() => handleModelSelect(model)}
                  disabled={isDisabled}
                  className={`w-full ${isDisabled ? 'line-through opacity-50' : ''}`}
                >
                  <model.icon className="mr-2 h-4 w-4" />
                  {model.name}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

export default ModelSelector;