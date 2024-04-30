
import ElevenLabs from "elevenlabs-node";
import * as dotenv from "dotenv";
dotenv.config();

const voice = new ElevenLabs(
    {
        apiKey: process.env.ELEVEN_LABS_API_KEY,
        voiceId: process.env.ELEVEN_LABS_VOICE_ID
    }
);

export async function streamTTSAudio(message) {
    const voiceTime = new Date().getTime();
    console.log(`Downloading ElevenLabs audio`);
    const stream = await voice.textToSpeechStream({
        voiceId: process.env.ELEVEN_LABS_VOICE_ID,
        textInput: message,
        stability: 0.6,
        similarityBoost: 0.6,
        modelId: "eleven_multilingual_v2",
    })
    console.log(`Audio download took ${new Date().getTime() - voiceTime}ms`);
    return stream;
}


export async function downloadTTSAudio(message) {
    const voiceTime = new Date().getTime();
    console.log(`Downloading ElevenLabs audio`);
    await voice.textToSpeech({
        voiceId: process.env.ELEVEN_LABS_VOICE_ID,
        fileName: 'audio/message.mp3',
        textInput: message,
        stability: 0.6,
        similarityBoost: 0.6,
        modelId: "eleven_multilingual_v2",
    })
    console.log(`Audio download took ${new Date().getTime() - voiceTime}ms`);

}