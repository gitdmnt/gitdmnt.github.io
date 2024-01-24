type isPressed = AudioBufferSourceNode | null;

export class PianoHandler {
  context: AudioContext;
  melodySource: isPressed[];
  codeSource: isPressed[];
  melodyGainNode: GainNode;
  codeGainNode: GainNode;

  constructor() {
    this.context = new window.AudioContext();
    this.melodySource = [null, null, null, null, null, null, null, null, null, null, null, null, null];
    this.codeSource = [null, null, null, null];
    this.melodyGainNode = this.context.createGain();
    this.codeGainNode = this.context.createGain();
  }

  play(channel, freq, velocity) {
    this.melodySource[channel] = this.context.createBufferSource();
    this.melodySource[channel].loop = true;
    const buf = this.createSound(this.sine(freq), 3.142);
    this.melodySource[channel].buffer = buf;
    this.melodyGainNode.gain.value = velocity / 100 * 0.5// ボリュームを小さく
    this.melodySource[channel].connect(this.melodyGainNode)
    this.melodyGainNode.connect(this.context.destination);
    this.melodySource[channel].start(0);
  }

  stop(channel) {
    if (this.melodySource[channel] != null) {
      this.melodySource[channel].stop()
      this.melodySource[channel] = null;
    }
  }

  playCode(code, velocity) {
    code.forEach((e, i) => {
      if (e != null) {
        this.codeSource[i] = this.context.createBufferSource();
        this.codeSource[i].loop = true;
        const buf = this.createSound(this.sine(e), 3.142);
        this.codeSource[i].buffer = buf;
        this.codeGainNode.gain.value = velocity / 100 * 0.25; // ボリュームを小さく
        this.codeSource[i].connect(this.codeGainNode);
        this.codeGainNode.connect(this.context.destination);
        this.codeSource[i].start(0);
      }
    })
  }

  stopCode() {
    [0, 1, 2, 3].forEach(i => {
      if (this.codeSource[i] != null) {
        this.codeSource[i].stop();
      }
    })
    this.codeSource = [null, null, null, null];
  }

  // fnをエンコードするだけ
  private createSound(fn, duration) {
    let sampleRate = this.context.sampleRate;
    let dt = 1 / sampleRate;
    let buffer = this.context.createBuffer(1, sampleRate * duration, sampleRate);
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
