import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isRecord, tokenizeString } from './_utils';
import { setKey } from './slash_handlers/_set_key';
import { addToList } from './slash_handlers/_add_to_list';
import { listAll } from './slash_handlers/_list_all';
import { getKey } from './slash_handlers/_get_key';
import { removeFromList } from './slash_handlers/_remove_from_list';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hasTextInBody = (body: unknown): body is { text: string; } => Boolean(isRecord(body) && 'text' in body && typeof body.text === 'string');

export default async function note(req: VercelRequest, res: VercelResponse) {
  const commandArray = tokenizeString(hasTextInBody(req.body) ? req.body.text : '');
  const action = commandArray[0];

  switch (action) {
    case 'set':
      await setKey(res, commandArray);
      break;
    case 'get':
      await getKey(res, commandArray);
      break;
    case 'list-set':
      await addToList(res, commandArray);
      break;
    case 'list-all':
      await listAll(res, commandArray);
      break;
    case 'list-remove':
      await removeFromList(res, commandArray);
      break;
    default:
      res.send({
        response_type: 'ephemeral',
        text: 'Wrong usage of the command!',
      });
  }
}
