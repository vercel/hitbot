import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isRecord, postToChannel } from '../_utils';

const hasEvent = (body: unknown): body is { event: { channel: { name: string; }; }; } => isRecord(body) && 'event' in body && isRecord(body.event) && 'channel' in body.event && 'name' in body.event && typeof body.event.name === 'string';

export async function channel_created(req: VercelRequest, res: VercelResponse) {
  const event = hasEvent(req.body) ? req.body.event : { channel: { name: '' } };

  try {
    await postToChannel(
      'general',
      res,
      `A new channel created with name \`${event.channel.name}\`!`
    );
  } catch (e) {
    console.log(e);
  }
}
