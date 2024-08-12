import { NextApiRequest, NextApiResponse } from 'next';
import { openai_client } from '@/lib/openai-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { models, systemPrompt, userPrompt } = req.body;

  if (!models || !Array.isArray(models) || models.length === 0) {
    return res.status(400).json({ message: 'Invalid models' });
  }

  try {
    const completion = await openai_client.chat.completions.create({
      model: 'gpt-4o-turbo', 
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const response = completion.choices[0]?.message?.content || 'No response generated';
    return res.status(200).json({ response });
  } catch (error) {
    console.error('Error generating response:', error);
    return res.status(500).json({ message: 'Error generating response' });
  }
}