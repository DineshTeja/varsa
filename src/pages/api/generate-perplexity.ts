import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import { PerplexityModel } from '@/lib/types/model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { models, messages, apiKey } = req.body;

  if (!models || !Array.isArray(models) || models.length === 0 || !messages || !Array.isArray(messages) || messages.length === 0 || !apiKey) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  const perplexityClient = new OpenAI({
    apiKey,
    baseURL: "https://api.perplexity.ai",
  });

  const singleMessage = messages.map((m) => m.content).join("\n");

  try {
    const responses = await Promise.all(models.map(async (model: PerplexityModel) => {
      const start = Date.now();
      const response = await perplexityClient.chat.completions.create({
        model: model.id,
        messages: [
          {
            role: "user",
            content: singleMessage,
          },
        ],
      });
      const end = Date.now();

      if (response.choices[0].message.content === null) {
        return {
          model: model.name,
          response: "Null response received from provider.",
          error: true,
          speed: 0,
        };
      }

      return {
        model: model.name,
        response: response.choices[0].message.content,
        error: false,
        speed: end - start,
      };
    }));

    return res.status(200).json({ responses });
  } catch (error) {
    console.error('Error generating response:', error);
    return res.status(500).json({ message: 'Error generating response' });
  }
}