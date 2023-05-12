  export const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };
 export  const synth = window.speechSynthesis;
