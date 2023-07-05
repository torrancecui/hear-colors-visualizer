import * as Tone from "tone";
import { convertColorsToNotes } from "../ColorNoteMapping";

export function attachEffectsChain(inputSignal) {
  const gain = new Tone.Gain(0.3);
  const filter = new Tone.Filter(1000, "lowpass");
  const reverb = new Tone.Reverb(8);
  const pingPong = new Tone.PingPongDelay("8n", 0.5);

  inputSignal.chain(filter, pingPong, reverb, gain, Tone.Destination);
}

export function playSynth(synth, selectedColors) {
  if (selectedColors.length > 0) {
    let notes = convertColorsToNotes(selectedColors);
    var pattern = new Tone.Pattern(function (time, note) {
      synth.triggerAttackRelease(note, 0.0625);
    }, notes);
    pattern.start(0);
    Tone.Transport.start();
  }
}

export function stopSynth() {
  Tone.Transport.stop();
}
