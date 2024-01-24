const context = new window.AudioContext();
let source = [null, null, null, null, null, null, null, null, null, null, null, null];

type isPressed = AudioBufferSourceNode | null;

export class PianoHandler {
  melodySource: isPressed[];
  context: AudioContext;
  gainNode: GainNode;

  constructor() {
    this.context = new window.AudioContext();
    this.melodySource = [null, null, null, null, null, null, null, null, null, null, null, null, null];
    this.gainNode = context.createGain();
  }

  play(channel, freq, velocity) {
    source[channel] = context.createBufferSource();
    source[channel].loop = true;
    const buf = this.createSound(this.sine(freq), 1);
    source[channel].buffer = buf;
    this.gainNode.gain.value = velocity / 100 // ボリュームを小さく
    source[channel].connect(this.gainNode)
    this.gainNode.connect(context.destination);
    source[channel].start(0);
  }

  stop(channel) {
    source[channel].stop()
    source[channel] = null;
  }

  // fnをエンコードするだけ
  private createSound(fn, duration) {
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

  // 正弦波を返すだけ
  private sine(freq) {
    return (t) => Math.sin(2 * Math.PI * freq * t);
  }

}
