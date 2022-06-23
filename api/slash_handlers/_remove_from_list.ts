import type { VercelResponse } from '@vercel/node';
import { redis } from '../_constants';

export async function removeFromList(res: VercelResponse, commandArray: string[]) {
  const listName = commandArray[1];
  if (!listName) {
    throw new Error('no listName defined');
  }

  let value = '';

  for (let i = 2; i < commandArray.length; i++) {
    value += `${commandArray[i] || ''} `;
  }

  try {
    const data = await redis.lrem(listName, 0, value);
    console.log('data from fetch:', data);

    res.send({
      response_type: 'in_channel',
      text: `Successfully removed "${value}" entry from list: "${listName}".`,
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
