type isPressed = AudioBufferSourceNode | null;

export class PianoHandler {
  context: AudioContext;
  melodySource: isPressed[];
  codeSource: isPressed[];
  melodyGainNode: GainNode[];
  codeGainNode: GainNode;
  masterGainNode: GainNode;

  ocilloParams: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  }


  constructor() {
    this.context = new window.AudioContext();

    // 終点 1<-1 マスターゲイン 1<-E 各メロディゲイン 1<-1 各メロディソース
    //                          1<-1 コードゲイン 1<-E 各コードソース
    this.masterGainNode = this.context.createGain();
    this.masterGainNode.gain.value = 1;
    this.masterGainNode.connect(this.context.destination);

    this.melodyGainNode = [this.context.createGain(), this.context.createGain(), this.context.createGain(), this.context.createGain(), this.context.createGain(), this.context.createGain(), this.context.createGain(), this.context.createGain(), this.context.createGain(), this.context.createGain(), this.context.createGain(), this.context.createGain(), this.context.createGain()];
    this.melodyGainNode.forEach(node => node.connect(this.masterGainNode));

    this.codeGainNode = this.context.createGain();
    this.codeGainNode.connect(this.masterGainNode);

    this.melodySource = [this.context.createBufferSource(), this.context.createBufferSource(), this.context.createBufferSource(), this.context.createBufferSource(), this.context.createBufferSource(), this.context.createBufferSource(), this.context.createBufferSource(), this.context.createBufferSource(), this.context.createBufferSource(), this.context.createBufferSource(), this.context.createBufferSource(), this.context.createBufferSource(), this.context.createBufferSource()];
    this.melodySource.forEach(source => source.loop = true);
    this.melodySource.forEach((node, i) => node.connect(this.melodyGainNode[i]));

    this.codeSource = [this.context.createBufferSource(), this.context.createBufferSource(), this.context.createBufferSource(), this.context.createBufferSource()];
    this.codeSource.forEach(source => source.loop = true);
    this.codeSource.forEach(node => node.connect(this.codeGainNode));

    this.ocilloParams = {
      attack: 0.01,
      decay: 0,
      sustain: 1,
      release: 0.1,
    }

  }

  play(channel, freq) {
    // melodySourceは毎回作り直さないといけない
    this.melodySource[channel].disconnect();

    this.melodySource[channel] = this.context.createBufferSource();
    this.melodySource[channel].connect(this.melodyGainNode[channel]);

    let currTime = this.context.currentTime;
    this.melodyGainNode[channel].gain.cancelScheduledValues(currTime);
    this.melodyGainNode[channel].gain.linearRampToValueAtTime(0, currTime);
    this.melodyGainNode[channel].gain.linearRampToValueAtTime(1, currTime + this.ocilloParams.attack);
    this.melodyGainNode[channel].gain.linearRampToValueAtTime(this.ocilloParams.sustain, currTime + this.ocilloParams.attack + this.ocilloParams.decay);

    const buf = this.createSound(this.sine(freq), 3.142);
    this.melodySource[channel].buffer = buf;
    this.melodySource[channel].start(0);
  }

  stop(channel) {
    const g = this.melodyGainNode[channel].gain.value;
    let currTime = this.context.currentTime;
    this.melodyGainNode[channel].gain.cancelScheduledValues(currTime);
    this.melodyGainNode[channel].gain.linearRampToValueAtTime(g, currTime);
    this.melodyGainNode[channel].gain.linearRampToValueAtTime(0, currTime + this.ocilloParams.release);
  }

  playCode(code) {
    let currTime = this.context.currentTime;
    this.codeGainNode.gain.cancelScheduledValues(currTime);
    this.codeGainNode.gain.linearRampToValueAtTime(0, currTime);
    this.codeGainNode.gain.linearRampToValueAtTime(0.5, currTime + this.ocilloParams.attack);
    this.codeGainNode.gain.linearRampToValueAtTime(0.5 * this.ocilloParams.sustain, currTime + this.ocilloParams.attack + this.ocilloParams.decay);

    code.forEach((e, i) => {
      if (e != null) {
        this.codeSource[i].disconnect();

        this.codeSource[i] = this.context.createBufferSource();
        this.codeSource[i].connect(this.codeGainNode);

        const buf = this.createSound(this.sine(e), 3.142);
        this.codeSource[i].buffer = buf;
        this.codeSource[i].start(0);
      }
    })
  }

  stopCode() {
    let currTime = this.context.currentTime;
    this.codeGainNode.gain.cancelScheduledValues(currTime);
    this.codeGainNode.gain.linearRampToValueAtTime(this.codeGainNode.gain.value, currTime);
    this.codeGainNode.gain.linearRampToValueAtTime(0, currTime + this.ocilloParams.release);
  }
  setMasterGain(volume) {
    this.masterGainNode.gain.value = volume / 100;
  }

  setAttack(a) {
    this.ocilloParams.attack = a;
  }

  setDecay(d) {
    this.ocilloParams.decay = d;
  }

  setSustain(s) {
    this.ocilloParams.sustain = s;
  }

  setRelease(r) {
    this.ocilloParams.release = r;
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
