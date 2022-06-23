import type { VercelResponse } from '@vercel/node';
import { redis } from '../_constants';

export async function listAll(res: VercelResponse, commandArray: string[]) {
  const listName = commandArray[1];
  if (!listName) {
    throw new Error('no listName defined');
  }

  try {
    const data = await redis.lrange(listName, 0, 2 ** 32 - 1);
    console.log('data from fetch:', data);

    let text = '';
    data.forEach((element, index) => {
      text += `${index + 1}. ${element}\n`;
    });

    res.send({
      response_type: 'in_channel',
      text: `"${listName}" contains: \n ${text}`,
    });
  } catch (err) {
    if (typeof err === 'string') {
      console.log('fetch Error:', err);
      res.send({
        response_type: 'ephemeral',
        text: `${err}`,
      });
    }
  }
}
