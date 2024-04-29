# Avatar-three.js

a three.js avatar that lipsyncs text to speech

Start the front end development server with

```
yarn
yarn dev
```

## back end Setup

Create a `.env` file at the root of the backend folder to add your**ElevenLabs API Key**. Refer to `.env.example` for the environment variable names.

https://elevenlabs.io/

install ffmpeg

```
brew install ffmpeg
```

Download the **RhubarbLibrary** binary for your **OS** [here](https://github.com/DanielSWolf/rhubarb-lip-sync/releases) and put it in your `bin` folder. `rhubarb` executable should be accessible through `usr/local/bin/rb/rhubarb`.

Start the development server from the backend folder with

```
yarn
yarn dev
```
