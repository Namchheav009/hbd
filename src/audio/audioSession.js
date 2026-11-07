let microphoneUsers = 0;

export function updateAudioSession() {
  try {
    if (globalThis.navigator?.audioSession) {
      navigator.audioSession.type = microphoneUsers ? 'play-and-record' : 'playback';
    }
  } catch { /* Older browsers choose their own audio routing. */ }
}

export function beginMicrophoneSession() {
  microphoneUsers++;
  updateAudioSession();
  let ended = false;
  return () => {
    if (ended) return;
    ended = true;
    microphoneUsers--;
    updateAudioSession();
  };
}
