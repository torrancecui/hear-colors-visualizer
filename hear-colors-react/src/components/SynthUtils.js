import * as Tone from "tone";
import { convertColorsToNotes } from "../ColorNoteMapping";

export function attachEffectsChain(inputSignal) {
  const gain = new Tone.Gain(0.3);
  // const filter = new Tone.Filter(10000, "lowpass");
  const reverb = new Tone.Reverb(8);
  const pingPong = new Tone.PingPongDelay("8n", 0.5);
  // const crusher = new Tone.BitCrusher(2);

  inputSignal.chain(pingPong, reverb, gain, Tone.Destination);
}

export function playSynth(arpeggiator, synth, selectedColors) {
  if (selectedColors.length > 0) {
    let notes = convertColorsToNotes(selectedColors);
    arpeggiator = new Tone.Pattern(function (time, note) {
      const now = Tone.now();
      synth.triggerAttackRelease(note, 0.0625, now + 0.5);
    }, notes);
    arpeggiator.start(0);
    Tone.Transport.start();
  }
}

export function stopSynth() {
  Tone.Transport.stop();
  Tone.Transport.cancel(0);
}
