import { useRef, useState, useEffect } from "react";
import "regenerator-runtime/runtime";
import { useChat } from "../hooks/useChat";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export const UI = () => {
  const ref = useRef();
  const { chat, loading, message, session, text } = useChat();
  const [recording, setRecording] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [showPerformance, setShowPerformance] = useState(false);
  const [performance, setPerformance] = useState('Quality');
  const [keyDown, setKeyDown] = useState(false);

  document.body.onkeydown = function(e) {
    if (e.key == " " ||
        e.code == "Space" ||      
        e.keyCode == 32      
    ) {
      if(!keyDown){
        setKeyDown(true)
        setRecording(true);
        recordingOnAudio.play();
        SpeechRecognition.startListening();
      }
    }
  }
  document.body.onkeyup = function(e) {
    if (e.key == " " ||
        e.code == "Space" ||      
        e.keyCode == 32      
    ) {
      setKeyDown(false)
      setRecording(false);
      SpeechRecognition.stopListening();
      if (transcript) {
        chat(transcript, session, performance)};
      resetTranscript();
      setUserMessage('')
    }
    recordingOffAudio.play();

  }

  const recordingOnAudio = new Audio("/audio/siriOn.mp3");
  const recordingOffAudio = new Audio("/audio/siriOff.mp3");
  const selectAudio = new Audio("/audio/select.mp3");
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript && recording) {
      setUserMessage(transcript)
    }
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowPerformance(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref])

  const selectPerformance =(performance) => {
    setPerformance(performance)
    setShowPerformance(false)
    selectAudio.play();
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
        <div className="flex justify-between">
          <div className="text-center items-center self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg">
            <h1 className="font-black text-xl">Brewella</h1>
            <br />
            <img width="100px" src="/textures/starbucks.png" />
          </div>
          <div>
              <div ref={ref} x-data="{ show: false, menu: false }">
                <button className="pointer-events-auto text-sm text-white font-semibold bg-emerald-600 px-4 py-2 rounded-full border-white border rounded-md outline-none hover:bg-emerald-500"
                  onClick={()=>setShowPerformance(!showPerformance)}>
                  <span className="flex">
                    <img className="invert mr-2" width="20" src="/textures/gear.png" />
                    Performance
                  </span>
                </button>
                {showPerformance&&(
                <div className="relative">
                <div className="bg-white bg-opacity-80 rounded-md p-3 min-w-[115px] top-1  absolute z-10" 
                    x-transition:enter="transition ease-out duration-100"
                    x-transition:enter-start="transform opacity-0 scale-95">
                  <ul
                      className="[&>li]:text-black [&>li]:text-sm [&>li]:cursor-pointer [&>li]:px-2 [&>li]:py-1 [&>li]:rounded-md [&>li]:transition-all active:[&>li]:scale-[0.99]">
                    <li className={`pointer-events-auto font-semibold hover:text-emerald-600 ${performance=='Quality'&& 'underline decoration-4 decoration-emerald-600'}`} onClick={()=>{selectPerformance('Quality')}}>Quality</li>
                    <li className={`pointer-events-auto font-semibold hover:text-emerald-600 ${performance=='Balanced'&& 'underline decoration-4 decoration-emerald-600'}`} onClick={()=>{selectPerformance('Balanced')}}>Balanced</li>
                    <li className={`pointer-events-auto font-semibold hover:text-emerald-600 ${performance=='Fast'&& 'underline decoration-4 decoration-emerald-600'}`} onClick={()=>{selectPerformance('Fast')}}>Fast</li>
                  </ul>
                </div>
              </div>)}
              </div>
            </div>
          </div>


        {(message?.message||text) ? (
          <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto mb-10px">
            <div className=" w-full text-center items-center self-start backdrop-blur-md bg-white bg-opacity-60 p-4 rounded-lg border-emerald-700 border-2">
              <h1 className="font-black text-xl font-bold text-emerald-700">
                Brewella:
              </h1>
              <h1 className="font-black text-xl font-normal text-emerald-700">
                {message?.message||text}
              </h1>
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto mb-10px">
            <div className=" w-full text-center items-center">
              <h1 className="font-black text-xl font-normal text-white animate-fade">
                Brewella is thinking
              </h1>
            </div>
          </div>
        ) : (
          <div className="flex items-center pointer-events-auto flex-col justify-center">
            {userMessage && (
              <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto mb-10px">
                <div className=" w-full text-center items-center self-start backdrop-blur-md bg-white bg-opacity-60 p-4 rounded-lg">
                  <h1 className="font-black text-xl font-bold text-zinc-600">
                    You:
                  </h1>
                  <h1 className="font-black text-xl font-normal text-zinc-600">
                    {userMessage}
                  </h1>
                </div>
              </div>
            )}
            <button
              className={
                recording
                  ? "pointer-events-auto bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full border-white border-2 animate-icon"
                  : "pointer-events-auto bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full border-white border-2"
              }
              onClick={() => {
                if (recording) {
                  setRecording(false);
                  SpeechRecognition.stopListening();
                  if (transcript) chat(transcript, session, performance);
                  resetTranscript();
                  setUserMessage('')
                  recordingOffAudio.play();

                } else {
                  setRecording(true);
                  recordingOnAudio.play();
                  SpeechRecognition.startListening();
                }
              }}
            >
              {recording ? (
                <img width="42px" src="/textures/waveform.png" />
              ) : (
                <img width="42px" src="/textures/microphone.png" />
              )}
            </button>
            {window.innerHeight<window.innerWidth&& <p className="mt-2 text-white opacity-60"> Or hold spacebar</p>}
          </div>
        )}
      </div>
    </>
  );
};
