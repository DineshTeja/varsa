import { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';
import { AnthropicModel } from '@/lib/types/model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { models, messages, apiKey } = req.body;

  if (!models || !Array.isArray(models) || models.length === 0 || !messages || !Array.isArray(messages) || messages.length === 0 || !apiKey) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  const anthropic = new Anthropic({
    apiKey: apiKey,
  });

  try {
    const responses = await Promise.all(models.map(async (model: AnthropicModel) => {
      const systemMessage = messages.find(msg => msg.role === 'system' || msg.role === 'system-language');
      const userMessages = messages.filter(msg => msg.role !== 'system' && msg.role !== 'system-language');

      const message = await anthropic.messages.create({
        model: model.id,
        max_tokens: 1024,
        system: systemMessage ? systemMessage.content : '',
        messages: userMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      });

      return {
        model: model.name,
        response: message.content[0].type === 'text' 
          ? message.content[0].text 
          : 'No text response generated'
      };
    }));

    return res.status(200).json({ responses });
  } catch (error) {
    console.error('Error generating response:', error);
    return res.status(500).json({ message: 'Error generating response' });
  }
}