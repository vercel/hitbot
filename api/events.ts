import { challenge } from './events_handlers/_challenge';
import { app_mention } from './events_handlers/_app_mention';
import { validateSlackRequest } from './_validate';
import { signingSecret } from './_constants';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isRecord } from './_utils';

const hasType = (body: unknown): body is { type: string; } => isRecord(body) && 'type' in body && typeof body.type === 'string';
const hasEvent = (body: unknown): body is { event: { type: string; }; } => isRecord(body) && 'event' in body && isRecord(body.event) && 'type' in body.event && typeof body.event.type === 'string';

export default async function events(req: VercelRequest, res: VercelResponse) {
    const type = hasType(req.body) ? req.body.type : '';

    if (type === 'url_verification') {
        challenge(req, res);
    } else if (validateSlackRequest(req, signingSecret)) {
        if (type === 'event_callback' && hasEvent(req.body)) {
            const event_type = req.body.event.type;

            switch (event_type) {
                case 'app_mention':
                    await app_mention(req, res);
                    break;
                default:
                    break;
            }
        } else {
            console.log('body:', req.body);
        }
    }
}