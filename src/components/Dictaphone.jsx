import React from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Dictaphone = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div>
      <p>Microphone: {listening ? "on" : "off"}</p>
      <button onClick={SpeechRecognition.startListening}>Start Speaking</button>
      <button onClick={SpeechRecognition.stopListening}>Get Fortune</button>
      <button onClick={resetTranscript}>Reset</button>
      <form id = "speechForm">
        <label id="userSpeech">{transcript}</label>
      </form>
    </div>
  );
};
export default Dictaphone;