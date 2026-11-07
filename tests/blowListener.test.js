import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createBlowDetector, listenForBlow } from '../src/audio/blowListener.js';

const wave = (volume) => new Float32Array(32).fill(volume);

test('stopping the microphone restores playback without closing the music context', async (t) => {
  const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  let grant;
  let stopped = 0;
  let resumed = 0;
  const session = { type: 'playback' };
  const context = {
    state: 'running',
    resume() { resumed++; return Promise.resolve(); },
    close() { assert.fail('Microphone closed the music context'); },
  };
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {
    audioSession: session,
    mediaDevices: { getUserMedia: () => new Promise((resolve) => { grant = resolve; }) },
  } });
  globalThis.window = { isSecureContext: true, AudioContext: class {} };
  globalThis.cancelAnimationFrame = () => {};
  t.after(() => {
    if (originalNavigator) Object.defineProperty(globalThis, 'navigator', originalNavigator);
    else delete globalThis.navigator;
    delete globalThis.window;
    delete globalThis.cancelAnimationFrame;
  });
  const stop = listenForBlow({
    getAudioContext: () => context,
    onState() {}, onLevel() {}, onBlow() {},
    onError() { assert.fail('Cancelled microphone reported an error'); },
  });
  assert.equal(session.type, 'play-and-record');
  stop();
  assert.equal(session.type, 'playback');
  assert.equal(resumed, 2);
  grant({ getTracks: () => [{ stop() { stopped++; } }] });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(stopped, 1);
});

test('ignores room noise and short spikes, detects a sustained breath', () => {
  const detect = createBlowDetector();
  assert.equal(detect(wave(0.01), 0).calibrating, true);
  assert.equal(detect(wave(0.01), 900).blown, false);
  assert.equal(detect(wave(0.1), 1000).blown, false);
  assert.equal(detect(wave(0.01), 1100).blown, false);
  assert.equal(detect(wave(0.1), 1200).blown, false);
  assert.equal(detect(wave(0.1), 1450).blown, true);
});

test('calibrates to a louder room without triggering on its background', () => {
  const detect = createBlowDetector();
  detect(wave(0.04), 0);
  detect(wave(0.04), 400);
  assert.equal(detect(wave(0.05), 1000).blown, false);
  assert.equal(detect(wave(0.05), 2000).blown, false);
  detect(wave(0.2), 2100);
  assert.equal(detect(wave(0.2), 2400).blown, true);
});

test('cancellation releases a microphone granted after the user stops', async (t) => {
  let grant;
  let stopped = 0;
  let closed = 0;
  const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {
    mediaDevices: { getUserMedia: () => new Promise((resolve) => { grant = resolve; }) },
  } });
  globalThis.window = { isSecureContext: true, AudioContext: class {
    state = 'running';
    resume() { return Promise.resolve(); }
    close() { closed++; this.state = 'closed'; return Promise.resolve(); }
  } };
  globalThis.cancelAnimationFrame = () => {};
  t.after(() => {
    if (originalNavigator) Object.defineProperty(globalThis, 'navigator', originalNavigator);
    else delete globalThis.navigator;
    delete globalThis.window;
    delete globalThis.cancelAnimationFrame;
  });
  const states = [];
  const stop = listenForBlow({
    onState: (value) => states.push(value),
    onLevel: () => assert.fail('Cancelled listener sampled audio'),
    onBlow: () => assert.fail('Cancelled listener blew candles'),
    onError: () => assert.fail('Cancelled listener reported an error'),
  });
  stop();
  stop();
  grant({ getTracks: () => [{ stop: () => stopped++ }] });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(stopped, 1);
  assert.equal(closed, 1);
  assert.deepEqual(states, ['requesting']);
});
