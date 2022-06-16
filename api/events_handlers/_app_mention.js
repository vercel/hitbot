import { postToChannel } from '../_utils';

export async function app_mention(req, res) {
    let event = req.body.event;

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
