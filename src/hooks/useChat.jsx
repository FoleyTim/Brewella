import { createContext, useContext, useEffect, useState } from "react";
const backendUrl = "https://brewellavoice-vtp77fbowq-nw.a.run.app";
// const backendUrl = "http://localhost:3050";

const ChatContext = createContext();
let voices
window.speechSynthesis.onvoiceschanged = function () {
  voices = window.speechSynthesis.getVoices();
};

export const ChatProvider = ({ children }) => {
  const [text, setText] = useState('');
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState();
  const onMessagePlayed = () => {
    setMessage('');
  };
  const onTextPlayed = () => {
    setText('');
  };

  const chat = async (message, session, performance) => {
    setLoading(true);
    switch (performance) {
      case 'Quality':
        quality(message, session, setSession, setLoading, setMessage)
        break;
      case 'Balanced':
        await balanced(message, session, setSession, setLoading, onTextPlayed, setText)
        break;
      case 'Fast':
        await fast(message, session, setSession, setLoading, onTextPlayed, setText)
        break;
      default:
        quality(message, session, setSession, setLoading, setMessage)
    }

  };

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        onMessagePlayed,
        loading,
        session,
        text
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const quality = (message, session, setSession, setLoading, setMessage) => {
  const responseTime = new Date().getTime();
  let audio;
  let visemes;
  let transcript;
  const data = fetch(`${backendUrl}/quality`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "*",
      "Access-Control-Allow-Headers": "*"
    },
    body: JSON.stringify({ message, session }),
  })
    .then(data => {
      visemes = data.headers.get("Visemes")
      setSession(data.headers.get("session"))
      transcript = data.headers.get("message")
      return data.blob()
    }
    ).then(blob => {
      audio = URL.createObjectURL(blob)
      setMessage({ message: transcript, audio, animation: 'Talking1', facialExpression: 'smile', lipsync: { mouthCues: JSON.parse(visemes) } });
      setLoading(false);
      console.log(`Quality Response took ${new Date().getTime() - responseTime}ms`);

    })
}

const balanced = (message, session, setSession, setLoading, onTextPlayed, setText) => {
  const responseTime = new Date().getTime();
  let transcript;
  const data = fetch(`${backendUrl}/balanced`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "*",
      "Access-Control-Allow-Headers": "*"
    },
    body: JSON.stringify({ message, session }),
  })
    .then(data => {
      setSession(data.headers.get("session"))
      transcript = data.headers.get("message")
      return data.blob()
    }
    ).then(blob => {
      const audioURL = URL.createObjectURL(blob)
      const audio = new Audio(audioURL)
      audio.play()
      audio.onended = onTextPlayed;
      setText(transcript)
      setLoading(false);
      console.log(`Balanced Response took ${new Date().getTime() - responseTime}ms`);
    })
}

const fast = async (message, session, setSession, setLoading, onTextPlayed, setText) => {
  const responseTime = new Date().getTime();

  const response = await fetch(`${backendUrl}/fast`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "*",
      "Access-Control-Allow-Headers": "*"
    },
    body: JSON.stringify({ message, session }),
  })
  const json = await response.json()
  setSession(json.session)
  const responseText = json.message;
  setText(responseText)
  console.log(`Fast Response took ${new Date().getTime() - responseTime}ms`);
  await speakText(responseText, onTextPlayed)
  setLoading(false)

}


function makeChunksOfText(text) {
  const maxLength = 190;
  let speechChunks = [];

  // Split the text into chunks of maximum length maxLength without breaking words
  while (text.length > 0) {
    if (text.length <= maxLength) {
      speechChunks.push(text);
      break;
    }

    let chunk = text.substring(0, maxLength + 1);

    let lastSpaceIndex = chunk.lastIndexOf(' ');
    if (lastSpaceIndex !== -1) {
      speechChunks.push(text.substring(0, lastSpaceIndex));
      text = text.substring(lastSpaceIndex + 1);

    } else {
      // If there are no spaces in the chunk, split at the maxLength
      speechChunks.push(text.substring(0, maxLength));
      text = text.substring(maxLength);
    }
  }

  return speechChunks
}


async function speakText(text, onTextPlayed) {
  const speechChunks = makeChunksOfText(text)
  for (let i = 0; i < speechChunks.length; i++) {
    await new Promise((resolve, reject) => {
      window.speechSynthesis.cancel();
      const tts = new SpeechSynthesisUtterance(speechChunks[i])
      tts.rate = 1.1
      tts.voice = voices[159]
      window.speechSynthesis.speak(tts)
      tts.onend = () => {
        if (i === speechChunks.length - 1) {
          onTextPlayed();
        };
        resolve();
      }

      tts.onerror = (error) => {
        resolve();
      };
    });
  }

}


export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};


