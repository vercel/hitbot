// This code snippet is based on https://github.com/antonputra/tutorials/tree/main/lessons/076

import type { VercelRequest } from '@vercel/node';
import crypto from 'crypto';
import { getHeaderValue } from './_utils';

export function validateSlackRequest(req: VercelRequest, signingSecret: string) {
  const requestBody = JSON.stringify(req['body']);

  const headers = req.headers;

  const timestamp = getHeaderValue(headers['x-slack-request-timestamp']) || '';
  const slackSignature = getHeaderValue(headers['x-slack-signature']) || '';
  const baseString = `v0: ${timestamp}: ${requestBody}`;

  const hmac = crypto
    .createHmac('sha256', signingSecret)
    .update(baseString)
    .digest('hex');
  const computedSlackSignature = 'v0=' + hmac;
  const isValid = computedSlackSignature === slackSignature;

  return isValid;
}
