import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MinusCircle, Paperclip,  Link, FileUp, MessageCircle } from 'lucide-react';
import { SiAnthropic } from 'react-icons/si';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Attachment {
  type: 'url' | 'pdf';
  content: string;
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

interface PromptInputProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const PromptInput: React.FC<PromptInputProps> = ({
  messages,
  setMessages,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAttachment, setNewAttachment] = useState<Attachment>({ type: 'url', content: '' });
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number | null>(null);
  const [indexingAttachment, setIndexingAttachment] = useState<string | null>(null);
  const [dots, setDots] = useState('');

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

  const handleAddAttachment = (index: number) => {
    setCurrentMessageIndex(index);
    setIsDialogOpen(true);
  };


  const handleUrlExtraction = async (url: string) => {
    try {
      const response = await fetch('/api/extract-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
  
      if (!response.ok) {
        if (response.status === 500) {
          const errorData = await response.json();
          toast({
            title: 'Error',
            description: errorData.message || 'An error occurred while extracting text from URL',
            variant: 'destructive',
          });
          return null;
        }
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error extracting text:', error);
      toast({
        title: 'Extraction Error',
        description: `Failed to extract text from ${url}`,
        variant: 'destructive',
      });
      return null;
    }
  };

  const handleAttachmentSubmit = async () => {
    setIsDialogOpen(false);
    if (currentMessageIndex !== null && newAttachment.content) {
      if (newAttachment.type === 'url') {
        setIndexingAttachment(newAttachment.content);
        setMessages(prev => prev.map((msg, i) => 
          i === currentMessageIndex 
            ? { 
                ...msg, 
                attachments: [
                  ...(msg.attachments || []), 
                  { 
                    type: newAttachment.type, 
                    content: newAttachment.content,
                  }
                ] 
              }
            : msg
        ));
        const extractedData = await handleUrlExtraction(newAttachment.content);
        if (extractedData) {
          setMessages(prev => prev.map((msg, i) => 
            i === currentMessageIndex 
              ? { 
                  ...msg, 
                  attachments: msg.attachments?.map(att => 
                    att.content === newAttachment.content 
                      ? { ...att, extractedData }
                      : att
                  )
                }
              : msg
          ));
        } else {
          setMessages(prev => prev.map((msg, i) => 
            i === currentMessageIndex 
              ? { 
                  ...msg, 
                  attachments: msg.attachments?.filter(att => att.content !== newAttachment.content)
                }
              : msg
          ));
          toast({
            title: 'Extraction Error',
            description: `Failed to extract text from ${newAttachment.content}`,
            variant: 'destructive',
          });
        }
        setIndexingAttachment(null);
      }
      setNewAttachment({ type: 'url', content: '' });
    }
  };

  const handleDeleteAttachment = (messageIndex: number, attachmentIndex: number) => {
    setMessages(prev => prev.map((msg, i) => 
      i === messageIndex 
        ? { ...msg, attachments: msg.attachments?.filter((_, j) => j !== attachmentIndex) }
        : msg
    ));
  };

  const animateDots = () => {
    setDots(prev => {
      if (prev === '...') return '';
      return prev + '.';
    });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (indexingAttachment) {
      interval = setInterval(animateDots, 500);
    }
    return () => clearInterval(interval);
  }, [indexingAttachment]);

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div key={index} className="relative">
          <div className="flex justify-between items-center mb-1">
            <label className="flex items-center text-sm font-medium text-gray-700">
              {message.role === 'system-anthropic-cache' && <SiAnthropic className="w-4 h-4 mr-2 flex-shrink-0" />}
              <span>
                {message.role === 'system-language' 
                  ? <>Language <span className="text-xs text-green-800">(Embedded in System Prompt)</span></>
                  : message.role === 'system-anthropic-cache'
                  ? <>Anthropic Cache <span className="text-xs text-green-800">(Embedded in System Prompt, Only for <strong>Claude 3.5 Sonnet</strong>)</span></>
                  : message.role.charAt(0).toUpperCase() + message.role.slice(1)}
              </span>
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

          <div className="mt-2">
            {message.attachments?.map((attachment, attachmentIndex) => (
              <div key={attachmentIndex} className="flex items-center mb-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        {attachment.type === 'url' ? <Link className="w-4 h-4 mr-2" /> : <FileUp className="w-4 h-4 mr-2" />}
                        <span className="text-sm text-gray-600 truncate max-w-[200px]">
                          {indexingAttachment === attachment.content ? (
                            <span className="text-blue-500">
                              Indexing {attachment.content}{dots}
                            </span>
                          ) : (
                            attachment.content
                          )}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-semibold">URL: {attachment.content}</p>
                      {attachment.extractedData && (
                        <Collapsible>
                          <CollapsibleTrigger className="text-sm text-blue-500 hover:underline">
                            Show extracted text
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <p className="mt-2 text-sm">
                              <span className="font-semibold">Title:</span> {attachment.extractedData.title}
                            </p>
                            <p className="mt-1 text-sm">
                              <span className="font-semibold">Type:</span> {attachment.extractedData.type}
                            </p>
                            <p className="mt-1 text-sm">
                              <span className="font-semibold">Extracted Text:</span>
                              <br />
                              {attachment.extractedData.cleaned_text.slice(0, 200)}...
                            </p>
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteAttachment(index, attachmentIndex)}
                  className="p-0.5 h-auto hover:bg-red-500 text-black hover:text-white ml-2"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          {message.role === 'system-anthropic-cache' && (
            <div className="flex mt-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddAttachment(index)}
                className="text-blue-500 hover:text-blue-700"
              >
                <Paperclip className="w-4 h-4 mr-1" /> Add Attachment
              </Button>
            </div>
          )}
        </div>
      ))}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleAddMessage}>
          <MessageCircle className="w-4 h-4 mr-1" /> Add Message
        </Button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Attachment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {newAttachment.type === 'url' && (
              <Input
                placeholder="Enter URL"
                value={newAttachment.content}
                onChange={(e) => setNewAttachment(prev => ({ ...prev, content: e.target.value }))}
              />
            )}
            <div className="flex justify-end">
              <Button onClick={handleAttachmentSubmit}>Add Attachment</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromptInput;