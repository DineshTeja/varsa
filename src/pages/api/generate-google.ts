import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GeminiModel } from '@/lib/types/model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { models, systemPrompt, userPrompt, languagePrompt, apiKey } = req.body;

  if (!models || !Array.isArray(models) || models.length === 0 || !apiKey) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const responses = await Promise.all(models.map(async (model: GeminiModel) => {
      const geminiModel = genAI.getGenerativeModel({ model: model.id });
      
      const prompt = `${systemPrompt}\n${languagePrompt}\n\nUser: ${userPrompt}`;
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        model: model.name,
        response: text || 'No response generated'
      };
    }));

    return res.status(200).json({ responses });
  } catch (error) {
    console.error('Error generating response:', error);
    return res.status(500).json({ message: 'Error generating response' });
  }
}