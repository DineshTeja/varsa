import { NextApiRequest, NextApiResponse } from 'next';
import { CohereClient } from 'cohere-ai';
import { CohereModel } from '@/lib/types/model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { models, systemPrompt, userPrompt, languagePrompt, apiKey } = req.body;

  if (!models || !Array.isArray(models) || models.length === 0 || !apiKey) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  const cohere = new CohereClient({
    token: apiKey,
  });

  try {
    const responses = await Promise.all(models.map(async (model: CohereModel) => {
      const response = await cohere.chat({
        model: model.id,
        message: userPrompt,
        preamble: `${systemPrompt}\n${languagePrompt}`,
      });

      return {
        model: model.name,
        response: response.text || 'No response generated'
      };
    }));

    return res.status(200).json({ responses });
  } catch (error) {
    console.error('Error generating response:', error);
    return res.status(500).json({ message: 'Error generating response' });
  }
}