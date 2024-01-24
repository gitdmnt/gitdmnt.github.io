const context = new window.AudioContext();
let source = [null, null, null, null, null, null, null, null, null, null, null, null];


const createSound = (fn, duration) => {
  let sampleRate = context.sampleRate;
  let dt = 1 / sampleRate;
  let buffer = context.createBuffer(1, sampleRate * duration, sampleRate);
  let data = buffer.getChannelData(0);
  // data.map((d, i) => fn(dt * i));
  for (let i = 0; i < data.length; i++) {
    data[i] = fn(dt * i)
  }
  return buffer;
}

export const play = (i, freq) => {
  source[i] = context.createBufferSource();
  const buf = createSound(sine(freq), 1);
  source[i].loop = true;
  source[i].buffer = buf;

  source[i].connect(context.destination);

  source[i].start(0);
}

export const stop = (i) => {
  source[i].stop()
  source[i] = null;
}

const sine = (freq) => {
  return (t) => Math.sin(2 * Math.PI * freq * t);
}