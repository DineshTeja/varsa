import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  try {
    const scriptPath = path.join(process.cwd(), 'src', 'app', 'scripts', 'extract-text.py');
    const command = `python3 "${scriptPath}" "${url}"`;

    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error('Python script error:', stderr);
      return res.status(500).json({ message: 'Error executing Python script', error: stderr });
    }

    if (stdout.includes('Error')) {
      throw new Error(stdout);
    }

    console.log('stdout:', stdout);

    const result = JSON.parse(stdout);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error extracting text:', error);
    return res.status(500).json({ message: 'Error extracting text', error: String(error) });
  }
}