import { beginMicrophoneSession } from './audioSession.js';

// Audio is analysed locally and is never connected to the speakers.
export function createBlowDetector() {
  let baseline = 0;
  let samples = 0;
  let breathStarted = null;
  return (waveform, elapsed) => {
    const rms = Math.sqrt(waveform.reduce((sum, value) => sum + value * value, 0) / waveform.length);
    if (elapsed < 800) {
      baseline += rms;
      samples++;
      return { level: 0, blown: false, calibrating: true };
    }
    const threshold = Math.max(0.035, baseline / Math.max(samples, 1) * 3);
    if (rms >= threshold) breathStarted ??= elapsed;
    else breathStarted = null;
    return { level: Math.min(1, rms / threshold), blown: breathStarted !== null && elapsed - breathStarted >= 250, calibrating: false };
  };
}

export function listenForBlow({ onState, onLevel, onBlow, onError, getAudioContext }) {
  let active = true;
  let stream, context, source, frame, timeout;
  let endSession;
  const stop = () => {
    if (!active) return;
    active = false;
    cancelAnimationFrame(frame);
    clearTimeout(timeout);
    stream?.getTracks().forEach((track) => track.stop());
    source?.disconnect();
    endSession?.();
    if (context && context.state !== 'closed') {
      if (getAudioContext) {
        // The music owns this context. Restore it instead of closing it.
        void context.resume().catch(() => {});
      } else void context.close().catch(() => {});
    }
  };
  const fail = (message) => {
    if (!active) return;
    stop();
    onError(message);
  };
  const start = async () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!window.isSecureContext) {
        fail('Microphone access needs HTTPS or localhost. You can still tap the candles.');
        return;
      }
      if (!navigator.mediaDevices?.getUserMedia || !AudioContext) {
        fail('This browser cannot use the microphone. Tap the candles instead.');
        return;
      }
      onState('requesting');
      endSession = beginMicrophoneSession();
      context = getAudioContext ? getAudioContext() : new AudioContext();
      const resumed = context.resume();
      const permission = navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false }, video: false,
      }).then((result) => {
        if (!active) result.getTracks().forEach((track) => track.stop());
        else stream = result;
      });
      timeout = setTimeout(() => fail('No breath detected yet. Try again, blow a little closer, or tap the candles.'), 25000);
      await Promise.all([resumed, permission]);
      if (!active) return;
      // Permission prompts and capture startup can interrupt Safari playback.
      await context.resume();
      if (!active) return;
      source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      const waveform = new Float32Array(analyser.fftSize);
      const detect = createBlowDetector();
      const started = performance.now();
      onState('calibrating');
      const sample = () => {
        if (!active) return;
        try {
          analyser.getFloatTimeDomainData(waveform);
          const result = detect(waveform, performance.now() - started);
          onLevel(result.level);
          if (!result.calibrating) onState('listening');
          if (result.blown) {
            stop();
            onBlow();
            return;
          }
          frame = requestAnimationFrame(sample);
        } catch {
          fail('The microphone stopped working. Please try again or tap the candles.');
        }
      };
      stream.getAudioTracks().forEach((track) => {
        track.onended = () => fail('Microphone disconnected. Try again or tap the candles.');
      });
      frame = requestAnimationFrame(sample);
    } catch (error) {
      fail(error.name === 'NotAllowedError'
        ? 'Microphone access was not allowed. Enable it in your browser to try again, or tap the candles.'
        : 'No microphone is available. Connect one and try again, or tap the candles.');
    }
  };
  void start();
  return stop;
}
