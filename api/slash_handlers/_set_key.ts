import type { VercelResponse } from '@vercel/node';
import { redis } from '../_constants';

export async function setKey(res: VercelResponse, commandArray: string[]) {
  const key = commandArray[1];
  const value = commandArray[2];

  if (!key || !value) {
    throw new Error('key and value not both defined');
  }

  try {
    const data = await redis.set(key, value);

    console.log('data from fetch:', data);
    res.send({
      response_type: 'in_channel',
      text: `Successfully set ${key}=${value}`,
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
