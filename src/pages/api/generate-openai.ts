import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { OpenAIModel } from '@/lib/types/model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { models, systemPrompt, userPrompt, languagePrompt, apiKey } = req.body;

  if (!models || !Array.isArray(models) || models.length === 0 || !apiKey) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  const openai = new OpenAI({ apiKey });

  try {
    const responses = await Promise.all(models.map(async (model: OpenAIModel) => {
      const completion = await openai.chat.completions.create({
        model: model.id,
        messages: [
          { role: 'system', content: `${systemPrompt}\n${languagePrompt}` },
          { role: 'user', content: userPrompt },
        ],
      });

      return {
        model: model.name,
        response: completion.choices[0]?.message?.content || 'No response generated'
      };
    }));

    return res.status(200).json({ responses });
  } catch (error) {
    console.error('Error generating response:', error);
    return res.status(500).json({ message: 'Error generating response' });
  }
}