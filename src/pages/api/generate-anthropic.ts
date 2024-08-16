import { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';
import { AnthropicModel } from '@/lib/types/model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { models, messages, apiKey } = req.body;

  if (!models || !Array.isArray(models) || models.length === 0 || !messages || !Array.isArray(messages) || messages.length === 0 || !apiKey) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  try {
    const responses = await Promise.all(models.map(async (model: AnthropicModel) => {
      const systemMessages = messages.filter(msg => msg.role === 'system' || msg.role === 'system-language' || msg.role === 'system-anthropic-cache');
      const userMessages = messages.filter(msg => msg.role !== 'system' && msg.role !== 'system-language' && msg.role !== 'system-anthropic-cache');

      const anthropic = new Anthropic({
        apiKey: apiKey,
        ...(model.cacheControl && {
          defaultHeaders: {
            'anthropic-beta': 'prompt-caching-2024-07-31'
          }
        })
      });

      if (model.cacheControl) {
        const messageParams: Anthropic.MessageCreateParams = {
          model: model.id,
          max_tokens: 1024,
          messages: userMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          system: systemMessages.map(msg => ({
            type: "text",
            text: msg.content,
            cache_control: { type: "ephemeral" }
          })),
          stream: false,
        };
      
        const message = await anthropic.messages.create(messageParams);
      
        return {
          model: model.name,
          response: message.content[0].type === 'text' 
            ? message.content[0].text 
            : 'No text response generated'
        };
      } else {
        const messageParams: Anthropic.MessageCreateParams = {
          model: model.id,
          max_tokens: 1024,
          messages: userMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        };

        if (systemMessages.length > 0) {
          messageParams.system = systemMessages.map(msg => msg.content).join('\n\n');
        }

        const message = await anthropic.messages.create(messageParams);

        return {
          model: model.name,
          response: message.content[0].type === 'text' 
            ? message.content[0].text 
            : 'No text response generated'
        };
      }
    }));

    return res.status(200).json({ responses });
  } catch (error) {
    console.error('Error generating response:', error);
    return res.status(500).json({ message: 'Error generating response', error: String(error) });
  }
}

// archived python sdk calling version (anthropic prompt caching) [LEGACY IMPLEMENTATION]

// import { NextApiRequest, NextApiResponse } from 'next';
// import Anthropic from '@anthropic-ai/sdk';
// import { AnthropicModel } from '@/lib/types/model';
// import { exec } from 'child_process';
// import { promisify } from 'util';
// import path from 'path';

// const execAsync = promisify(exec);

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   const { models, messages, apiKey } = req.body;

//   if (!models || !Array.isArray(models) || models.length === 0 || !messages || !Array.isArray(messages) || messages.length === 0 || !apiKey) {
//     return res.status(400).json({ message: 'Invalid request body' });
//   }

//   const anthropic = new Anthropic({
//     apiKey: apiKey,
//   });

//   try {
//     // await execAsync('pip install anthropic');

//     const responses = await Promise.all(models.map(async (model: AnthropicModel) => {
//       const systemMessages = messages.filter(msg => msg.role === 'system' || msg.role === 'system-language' || msg.role === 'system-anthropic-cache');
//       const userMessages = messages.filter(msg => msg.role !== 'system' && msg.role !== 'system-language' && msg.role !== 'system-anthropic-cache');

//       if (model.cacheControl) {
//         console.log('Executing cache control script');
//         const scriptPath = path.join(process.cwd(), 'src', 'app', 'scripts', 'anthropic-cache-control-beta.py');
//         console.log('Script path:', scriptPath);
//         const encodedSystemMessages = Buffer.from(JSON.stringify(systemMessages)).toString('base64');
//         const encodedUserMessages = Buffer.from(JSON.stringify(userMessages)).toString('base64');
//         const command = `python3 "${scriptPath}" "${apiKey}" "${model.id}" "${encodedSystemMessages}" "${encodedUserMessages}"`;
//         console.log('Executing command:', command);
      
//         try {
//           const { stdout, stderr } = await execAsync(command);
//           console.log('Python script stdout:', stdout);
//           if (stderr) {
//             console.error('Python script stderr:', stderr);
//             throw new Error(stderr);
//           }
//           return {
//             model: model.name,
//             response: stdout.trim()
//           };
//         } catch (error) {
//           console.error('Error executing Python script:', error);
//           throw error;
//         }
//       } else {
//         const messageParams: Anthropic.MessageCreateParams = {
//           model: model.id,
//           max_tokens: 1024,
//           messages: userMessages.map(msg => ({
//             role: msg.role,
//             content: msg.content
//           }))
//         };

//         if (systemMessages.length > 0) {
//           messageParams.system = systemMessages.map(msg => msg.content).join('\n\n');
//         }

//         const message = await anthropic.messages.create(messageParams);

//         return {
//           model: model.name,
//           response: message.content[0].type === 'text' 
//             ? message.content[0].text 
//             : 'No text response generated'
//         };
//       }
//     }));

//     return res.status(200).json({ responses });
//   } catch (error) {
//     console.error('Error generating response:', error);
//     return res.status(500).json({ message: 'Error generating response', error: String(error) });
//   }
// }