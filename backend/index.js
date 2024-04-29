import cors from "cors";
import express from "express";
import fs from "fs-extra";
import * as dotenv from "dotenv";
import { onRequest } from "firebase-functions/v2/https";
import { sendMessageToOpenAI } from "./openAI.service.js"
import { downloadTTSAudio, streamTTSAudio } from "./eleven-labs.service.js"
import { lipSyncMessage, readJsonTranscript, cleanUp } from "./lipsyncing.service.js"
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = 3050;

app.post("/fast", async (req, res) => {
  const { message, session } = req.body
  const callback = (message, session) => {
    res.set({
      session: session,
      "Access-Control-Expose-Headers": "*",
      "Access-Control-Allow-Headers": "*"
    })
    res.send({ message, session })
  }
  await sendMessageToOpenAI(session, message, callback)
})


app.post("/balanced", async (req, res) => {
  const { message, session } = req.body
  const callback = async (message, session) => {
    const mp3Stream = await streamTTSAudio(message)
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": `inline; filename=tts.mp3`,
      session: session,
      message: message,
      "Access-Control-Expose-Headers": "*",
      "Access-Control-Allow-Headers": "*"
    })
    res.set('accept-ranges', 'bytes');
    mp3Stream.on('data', (chunk) => {
      res.write(chunk);
    });

    mp3Stream.on('error', () => {
      res.sendStatus(404);
    });

    mp3Stream.on('end', () => {
      res.end();
    });
  }
  await sendMessageToOpenAI(session, message, callback)
})



app.post("/quality", async (req, res) => {
  const { message, session } = req.body
  const callback = async (message, session) => {
    await downloadTTSAudio(message)
    const mp3Stream = fs.createReadStream('audio/message.mp3')

    const lipsyncData = await textToSpeech()
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": `inline; filename=tts.mp3`,
      Visemes: JSON.stringify(lipsyncData.mouthCues),
      session: session,
      message: message,
      "Access-Control-Expose-Headers": "*",
      "Access-Control-Allow-Headers": "*"
    })
    res.set('accept-ranges', 'bytes');
    mp3Stream.on('data', (chunk) => {
      res.write(chunk);
    });

    mp3Stream.on('error', () => {
      res.sendStatus(404);
    });

    mp3Stream.on('end', () => {
      res.end();
    });

  }
  await sendMessageToOpenAI(session, message, callback)
})

const textToSpeech = async () => {
  let lipsyncData;
  try {
    await lipSyncMessage()
    lipsyncData = await readJsonTranscript('audio/message.json')
  } catch (e) {
    console.error(e)
  } finally {
    cleanUp();
    return lipsyncData
  }
}

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});


export const brewellaVoice = onRequest({ timeoutSeconds: 60, memory: "1GiB", region: ["europe-west2"] }, app)