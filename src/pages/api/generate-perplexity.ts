import { NextApiRequest, NextApiResponse } from 'next';
import pplx from '@api/pplx';
import { PerplexityModel } from '@/lib/types/model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { models, messages, apiKey } = req.body;

  if (!models || !Array.isArray(models) || models.length === 0 || !messages || !Array.isArray(messages) || messages.length === 0 || !apiKey) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  try {
    const responses = await Promise.all(models.map(async (model: PerplexityModel) => {
      const { data } = await pplx.post_chat_completions({
        model: model.id,
        messages: messages.map(msg => ({
          role: msg.role === 'system-language' ? 'system' : msg.role,
          content: msg.content
        })),
      });

      return {
        model: model.name,
        response: data.choices?.[0]?.message?.content ?? 'No response generated'
      };
    }));

    return res.status(200).json({ responses });
  } catch (error) {
    console.error('Error generating response:', error);
    return res.status(500).json({ message: 'Error generating response' });
  }
}