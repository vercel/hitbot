import type { VercelResponse } from '@vercel/node';
import { isObject } from 'lodash';
import fetch from 'node-fetch';
import { token } from './_constants';

export const getHeaderValue = (val: string | string[] | undefined) => Array.isArray(val) ? val[0] : val;

export const isRecord = (body: unknown): body is Record<string, unknown> => isObject(body);

export function tokenizeString(string: string) {
    const array = string.split(' ').filter((element) => {
        return element !== '';
    });
    console.log('Tokenized version:', array);
    return array;
}

export async function postToChannel(channel: string, res: VercelResponse, payload: string) {
    console.log('channel:', channel);
    const channelId = await channelNameToId(channel);

    console.log('ID:', channelId);

    const message = {
        channel: channelId,
        text: payload,
    };

    try {
        const url = 'https://slack.com/api/chat.postMessage';
        const response = await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(message),
        });
        const data = await response.json() as Record<string, unknown>;

        console.log('data from fetch:', data);
        res.json({ ok: true });
    } catch (err: unknown) {
        console.log('fetch Error:', err);
        if (typeof err === 'string') {
            res.send({
                response_type: 'ephemeral',
                text: `${err}`,
            });
        }
    }
}

async function channelNameToId(channelName: string) {
    let generalId: string | undefined;
    let id: string | undefined;

    try {
        const url = 'https://slack.com/api/conversations.list';
        const response = await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('conservation response: ', response);
        const data = await response.json() as { channels: { name: string, id: string; }[]; };
        data.channels.forEach((element) => {
            if (element.name === channelName) {
                id = element.id;
            }
            if (element.name === 'general') generalId = element.id;
        });
        if (id) {
            return id;
        } else return generalId;
    } catch (err) {
        console.log('fetch Error:', err);
    }
    return id;
}
