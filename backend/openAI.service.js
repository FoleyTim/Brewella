
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
        .on('textCreated', (text) => process.stdout.write('\nassistant > '))
        .on('textDelta', (textDelta, snapshot) => {
            openAIResponse += textDelta.value
        })
        .on('end', () => {
            callBack(openAIResponse, session)
        });
}