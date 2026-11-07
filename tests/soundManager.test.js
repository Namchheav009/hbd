import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { soundManager } from '../src/audio/soundManager.js';

class FakeAudioContext {
  state = 'running';
  currentTime = 0;
  destination = {};
  createOscillator() {
    return {
      frequency: { setValueAtTime() {} },
      connect() {}, disconnect() {}, start() {},
      stops: 0,
      stop() { this.stops++; },
    };
  }
  createGain() {
    return {
      gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
      connect() {}, disconnect() {},
    };
  }
}

afterEach(() => {
  soundManager.stop();
  soundManager.ctx = null;
  soundManager.customAudio = null;
  delete globalThis.window;
  delete globalThis.Audio;
});

test('pause stops every scheduled music oscillator and cancels the loop', async () => {
  globalThis.window = { AudioContext: FakeAudioContext };
  assert.equal(await soundManager.togglePlay(), true);
  const scheduled = [...soundManager.musicNodes];
  assert.ok(scheduled.length > 100);
  assert.equal(await soundManager.togglePlay(), false);
  assert.ok(scheduled.every((node) => node.stops === 2));
  assert.equal(soundManager.musicNodes.size, 0);
  assert.equal(soundManager.musicTimeout, null);
});

test('unavailable audio reports stopped without rejecting', async () => {
  globalThis.window = {};
  assert.equal(await soundManager.togglePlay(), false);
  assert.equal(soundManager.isPlaying, false);
});

test('mobile synth waits for the context to resume before scheduling music', async () => {
  let resume;
  globalThis.window = { AudioContext: class extends FakeAudioContext {
    state = 'suspended';
    createBuffer() { return {}; }
    createBufferSource() { return { connect() {}, disconnect() {}, start() {} }; }
    resume() { return new Promise((resolve) => { resume = () => { this.state = 'running'; resolve(); }; }); }
  } };
  const pending = soundManager.togglePlay();
  assert.equal(soundManager.musicNodes.size, 0);
  resume();
  assert.equal(await pending, true);
  assert.ok(soundManager.musicNodes.size > 0);
});

test('interrupted iPhone audio is resumed on the next play tap', async () => {
  let resumes = 0;
  globalThis.window = { AudioContext: class extends FakeAudioContext {
    state = 'interrupted';
    resume() { resumes++; this.state = 'running'; return Promise.resolve(); }
  } };
  assert.equal(await soundManager.togglePlay(), true);
  assert.equal(resumes, 1);
});

test('a failed mobile resume does not report music as playing', async () => {
  globalThis.window = { AudioContext: class extends FakeAudioContext {
    state = 'suspended';
    createBuffer() { return {}; }
    createBufferSource() { return { connect() {}, disconnect() {}, start() {} }; }
    resume() { return Promise.reject(new Error('Blocked')); }
  } };
  assert.equal(await soundManager.togglePlay(), false);
  assert.equal(soundManager.musicNodes.size, 0);
});

test('failed custom audio falls back to the synthesizer', async () => {
  globalThis.window = { AudioContext: FakeAudioContext };
  globalThis.Audio = class {
    async play() { throw new Error('Missing file'); }
    pause() {}
  };
  assert.equal(await soundManager.togglePlay('/missing.mp3'), true);
  assert.ok(soundManager.musicNodes.size > 0);
});

test('a rejected pending play cannot restart music after pause', async () => {
  globalThis.window = { AudioContext: FakeAudioContext };
  let rejectPlay;
  globalThis.Audio = class {
    play() { return new Promise((resolve, reject) => { rejectPlay = reject; }); }
    pause() {}
  };
  const pending = soundManager.togglePlay('/music.mp3');
  assert.equal(await soundManager.togglePlay('/music.mp3'), false);
  rejectPlay(new Error('Interrupted'));
  assert.equal(await pending, false);
  assert.equal(soundManager.musicNodes.size, 0);
});

test('a resolved pending play remains paused', async () => {
  globalThis.window = {};
  let resolvePlay;
  let pauses = 0;
  globalThis.Audio = class {
    play() { return new Promise((resolve) => { resolvePlay = resolve; }); }
    pause() { pauses++; }
  };
  const pending = soundManager.togglePlay('/music.mp3');
  soundManager.stop();
  resolvePlay();
  assert.equal(await pending, false);
  assert.ok(pauses >= 2);
});
