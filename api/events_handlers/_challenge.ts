import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isRecord } from "../_utils";

const hasChallengeInBody = (body: unknown): body is { challenge: string; } => Boolean(isRecord(body) && 'challenge' in body && typeof body.challenge === 'string');


export function challenge(req: VercelRequest, res: VercelResponse) {

  if (hasChallengeInBody(req.body)) {
    console.log('req body challenge is:', req.body.challenge);
    res.status(200).send({
      challenge: req.body.challenge,
    });
  }
}
