import type { VercelResponse } from '@vercel/node';
import { redis } from '../_constants';

export async function getKey(res: VercelResponse, commandArray: string[]) {
  const key = commandArray[1];

  if (!key) {
    throw new Error('no key defined');
  }

  try {
    const data = await redis.get(key) as string;
    console.log('data from fetch:', data);

    res.send({
      response_type: 'in_channel',
      text: `Value for "${key}": "${data}"`,
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
