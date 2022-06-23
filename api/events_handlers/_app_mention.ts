import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isRecord, postToChannel } from '../_utils';

const hasEventUser = (body: unknown): body is { event: { user: string; }; } => isRecord(body) && 'event' in body && isRecord(body.event) && 'user' in body.event && typeof body.event.user === 'string';

export async function app_mention(req: VercelRequest, res: VercelResponse) {
    const event = hasEventUser(req.body) ? req.body.event : { user: '' };

    try {
        await postToChannel(
            'hitbot-testing',
            res,
            `Hi there! Thanks for mentioning me, <@${event.user}>!`,
        );
    } catch (e) {
        console.log(e);
    }
}
