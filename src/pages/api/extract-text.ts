import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    $('script, style').remove();
    const rawText = $('body').text().trim();

    const cleanedResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a text cleaning assistant." },
        { role: "user", content: `Clean the following text by removing duplicate lines and unnecessary whitespace, and generate a JSON with two fields: 'title', 'cleaned_text'. Respond only with the JSON, no additional text:\n\n${rawText.slice(0, 4000)}` }
      ]
    });

    if (!cleanedResponse.choices[0].message.content) {
      throw new Error('No content in the response');
    }

    const result = JSON.parse(cleanedResponse.choices[0].message.content);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error extracting text:', error);
    return res.status(500).json({ message: 'Error extracting text', error: String(error) });
  }
}