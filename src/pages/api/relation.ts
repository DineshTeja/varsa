import { NextApiRequest, NextApiResponse } from 'next';
import { openai_client } from '@/lib/openai-client';
import { teluguRelations } from '@/lib/telugurelations';

const MAX_RETRIES = 3;

async function getGPTResponse(description: string, retryCount = 0): Promise<any> {
    try {
        const completion = await openai_client.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: 'You are a helpful assistant with expert knowledge of Telugu family relations, including extended and distant relatives.' },
                { role: 'user', content: `
                Use the following Telugu relations data as a base reference, but also consider that relation names can be used flexibly for distant relatives based on association. For example, one might call their mother's cousin sister "peddamma" even if she's not a direct aunt.
            
                ${JSON.stringify(teluguRelations)}
            
                Analyze the given description and determine the most appropriate Telugu relation. If there isn't an exact match in the data, use your knowledge to provide the closest or most commonly used relation term, and explain the reasoning.
            
                Description: ${description}
            
                Response format: {
                    "relation": "relation name in Telugu (written in English)",
                    "description": "Detailed reasoning for the chosen relation, including any flexibility in its usage",
                    "pronunciation": "pronunciation",
                    "literal_meaning": "literal translation or meaning of the relation term (if applicable)"
                }
                ` },
            ],
            max_tokens: 300,
            });
  
      const messageContent = completion.choices[0]?.message?.content?.trim();
  
      if (!messageContent) {
        throw new Error('Invalid response from OpenAI');
      }
  
      return JSON.parse(messageContent);
    } catch (error) {
      if (retryCount < MAX_RETRIES - 1) {
        console.log(`Retry attempt ${retryCount + 1} for description: ${description}`);
        return getGPTResponse(description, retryCount + 1);
      }
      throw error;
    }
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ message: 'Description is required' });
  }

  try {
    const response = await getGPTResponse(description);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}