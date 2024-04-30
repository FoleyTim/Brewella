import fs from "fs-extra";
import { exec } from "child_process";


export async function lipSyncMessage() {
    const conversionTime = new Date().getTime();
    console.log(`Starting audio conversion`);
    await execCommand(
        `ffmpeg -y -i audio/message.mp3 audio/message.wav`
        // -y to overwrite the file
    );
    console.log(`Conversion took ${new Date().getTime() - conversionTime}ms`);

    const lipSyncTime = new Date().getTime();
    console.log(`Starting Lipsync`);

    await execCommand(
        `./Rhubarb-${process.platform === "darwin" ? "mac" : "linux"}/rhubarb -f json -o audio/message.json audio/message.wav -r phonetic`
    );
    // -r phonetic is faster but less accurate
    console.log(`Lip sync took ${new Date().getTime() - lipSyncTime}ms`);
};

export async function readJsonTranscript(file) {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data);
};

export async function cleanUp() {
    try {
        await fs.promises.unlink('audio/message.json');
    } catch (error) {
        console.error('error removing message.json: ', error.message);
    }
    try {
        await fs.promises.unlink('audio/message.mp3');
    } catch (error) {
        console.error('error removing message.mp3: ', error.message);
    }
    try {
        await fs.promises.unlink('audio/message.wav');
    } catch (error) {
        console.error('error removing message.wav: :', error.message);
    }
}

const execCommand = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) reject(error);
            resolve(stdout);
        });
    });
};
