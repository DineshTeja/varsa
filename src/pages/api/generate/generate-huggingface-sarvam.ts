import { NextApiRequest, NextApiResponse } from 'next';
import { ModelWithIcon } from '@/lib/modelUtils';

async function query(data: { inputs: string }, apiKey: string) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/sarvamai/sarvam-2b-v0.5",
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { models, messages, apiKey } = req.body;

  if (!models || !Array.isArray(models) || models.length === 0 || !messages || !Array.isArray(messages) || messages.length === 0 || !apiKey) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  try {
    const prompt = "Translate this into Hindi: " + messages.map(msg => `${msg.content}`).join('\n');
    const responses = await Promise.all(models.map(async (model: ModelWithIcon) => {
      const output = await query({ inputs: prompt }, apiKey);

      console.log(output);

      if (!output[0]?.generated_text) {
        throw new Error(output.error || 'No generated text found in the response');
      }

      let generatedText = output[0].generated_text;

      return {
        model: model.name,
        response: generatedText,
      };
    }));

    return res.status(200).json({ responses });
  } catch (error) {
    console.error('Error generating response:', error);
    return res.status(500).json({ message: 'Error generating response', error: error instanceof Error ? error.message : String(error) });
  }
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}