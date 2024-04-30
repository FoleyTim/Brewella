import { useState, useEffect } from "react";
import "regenerator-runtime/runtime";
import { useChat } from "../hooks/useChat";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Settings } from "./Settings";

export const UI = () => {
  const { chat, loading, message, session, text } = useChat();
  const [isRecording, setIsRecording] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [performance, setPerformance] = useState('Quality');
  const [keyDown, setKeyDown] = useState(false);
  const recordingOnAudio = new Audio("/audio/siriOn.mp3");
  const recordingOffAudio = new Audio("/audio/siriOff.mp3");

  document.body.onkeydown = function (e) {
    if (e.key == " " ||
      e.code == "Space" ||
      e.keyCode == 32
    ) {
      if (!keyDown) {
        setKeyDown(true)
        startRecording()
      }
    }
  }

  document.body.onkeyup = function (e) {
    if (e.key == " " ||
      e.code == "Space" ||
      e.keyCode == 32
    ) {
      setKeyDown(false)
      endRecording()
    }
  }

  const endRecording = () => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
    if (transcript) {
      chat(transcript, session, performance)
    };
    resetTranscript();
    setUserMessage('')
    recordingOffAudio.play();
  }

  const startRecording = () => {
    setIsRecording(true);
    recordingOnAudio.play();
    SpeechRecognition.startListening();
  }

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript && isRecording) {
      setUserMessage(transcript)
    }
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
        <div className="flex justify-between">
          <BrewellaLogo />
          <Settings setPerformance={setPerformance} performance={performance} />
        </div>
        {(message?.message || text) ? (
          <Message user="Brewella:" message={message?.message || text} />
        ) : loading ? (
          <LoadingMessage />
        ) : (
          <div className="flex items-center pointer-events-auto flex-col justify-center">
            {userMessage && (
              <Message user="You:" message={transcript} />
            )}
            <MicButton
              isRecording={isRecording}
              startRecording={startRecording}
              endRecording={endRecording} />
          </div>
        )}
      </div>
    </>
  );
};

const MicButton = ({ isRecording, startRecording, endRecording }) => (
  <>
    <button
      className={
        `pointer-events-auto bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full border-white border-2 ${isRecording && 'animate-icon'}`
      }
      onClick={() => {
        if (isRecording) {
          endRecording()
        } else {
          startRecording()
        }
      }}
    >
      <img width="42px" src={isRecording ? "/textures/waveform.png" : "/textures/microphone.png"} />
    </button>
    {window.innerHeight < window.innerWidth && <p className="mt-2 text-white opacity-60"> Or hold spacebar</p>}
  </>
)

const BrewellaLogo = () => (
  <div className="text-center items-center self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg">
    <h1 className="font-black text-xl">Brewella</h1>
    <br />
    <img width="100px" src="/textures/starbucks.png" />
  </div>
);

const LoadingMessage = () => (
  <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto mb-10px">
    <div className=" w-full text-center items-center">
      <h1 className="font-black text-xl font-normal text-white animate-fade">
        Brewella is thinking
      </h1>
    </div>
  </div>
)

const Message = ({ user, message }) => (
  <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto mb-10px">
    <div className={`w-full text-center items-center self-start backdrop-blur-md bg-white bg-opacity-60 p-4 rounded-lg  ${user === "Brewella:" && 'border-emerald-700 border-2'}`}>
      <h1 className={`font-black text-xl font-bold ${user === "Brewella:" ? 'text-emerald-700' : 'text-zinc-600'}`}>
        {user}
      </h1>
      <h1 className={`font-black text-xl font-normal ${user === "Brewella:" ? 'text-emerald-700' : 'text-zinc-600'}`}>
        {message}
      </h1>
    </div>
  </div>
)