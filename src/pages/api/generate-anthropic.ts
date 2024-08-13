import { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';
import { AnthropicModel } from '@/lib/types/model';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { models, systemPrompt, userPrompt } = req.body;

  if (!models || !Array.isArray(models) || models.length === 0) {
    return res.status(400).json({ message: 'Invalid models' });
  }

  try {
    const responses = await Promise.all(models.map(async (model: AnthropicModel) => {
      const message = await anthropic.messages.create({
        model: model.id,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          { role: "user", content: userPrompt }
        ]
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