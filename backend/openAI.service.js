
import OpenAI from 'openai';
dotenv.config();
import * as dotenv from "dotenv";

const openai = new OpenAI({
    apiKey: process.env['OPEN_AI_KEY'],
});

export async function sendMessageToOpenAI(session, message, callBack) {
    if (!session) {
        session = await openai.beta.threads.create();
        session = session.id
    }
    await openai.beta.threads.messages.create(
        session,
        {
            role: "user",
            content: message
        }
    );
    let openAIResponse = '';
    const run = openai.beta.threads.runs.stream(session, {
        assistant_id: process.env.OPEN_AI_ASSISTANT_ID
    })
        .on('textDelta', (textDelta, snapshot) => {
            openAIResponse += textDelta.value
        })
        .on('end', () => {
            //remove emojis
            openAIResponse = openAIResponse.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
            callBack(openAIResponse, session)
        });
}