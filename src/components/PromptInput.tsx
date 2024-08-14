import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface PromptInputProps {
  messages: { role: string; content: string; isDefault?: boolean }[];
  setMessages: React.Dispatch<React.SetStateAction<{ role: string; content: string; isDefault?: boolean }[]>>;
}

const PromptInput: React.FC<PromptInputProps> = ({
  messages,
  setMessages,
}) => {
  const handleAddMessage = () => {
    const lastMessage = messages[messages.length - 1];
    const newRole = lastMessage.role === 'user' ? 'assistant' : 'user';
    setMessages(prev => [...prev, { role: newRole, content: '' }]);
  };

  const handleMessageChange = (index: number, content: string) => {
    setMessages(prev => prev.map((msg, i) => i === index ? { ...msg, content } : msg));
  };

  const handleDeleteMessage = (index: number) => {
    setMessages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div key={index} className="relative">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              {message.role === 'system-language' 
                ? 'Language (Embedded in System Prompt)' 
                : message.role.charAt(0).toUpperCase() + message.role.slice(1)}
            </label>
            {!message.isDefault && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteMessage(index)}
                className="p-0.5 h-auto hover:bg-red-500 text-black hover:text-white"
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="relative">
            <Textarea
              value={message.content}
              onChange={(e) => handleMessageChange(index, e.target.value)}
              className="min-h-[100px]"
              placeholder={`Write a poem about cute birds in one paragraph...`}
            />
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleAddMessage}>
          <PlusCircle className="w-4 h-4 mr-1" /> Add Message
        </Button>
      </div>
    </div>
  );
};

export default PromptInput;