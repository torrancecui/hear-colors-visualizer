// "<COLOR>: ["<NOTE>", "<HEXCOLOR>"]

// Ordered by Circle of Fifths
export const ColorNoteMapping = {
  RED: ["C", "#C3A4A5"],
  VERMILLION: ["G", "#DFAC9C"],
  ORANGE: ["D", "#EDB990"],
  AMBER: ["A", "#F4D588"],
  YELLOW: ["E", "#DDDF8E"],
  CHARTREUSE: ["B", "#BAE58C"],
  GREEN: ["F#", "#A7E498"],
  TEAL: ["C#", "#96D9BC"],
  BLUE: ["G#", "#9CCCD9"],
  VIOLET: ["D#", "#ABBAD9"],
  PURPLE: ["A#", "#CFC0ED"],
  MAGENTA: ["F", "#F0CEF3"],
};

// Ordered by C major Pentatonic Scale
// export const ColorNoteMapping = {
//   RED: ["C", "#C3A4A5"],
//   VERMILLION: ["D", "#DFAC9C"],
//   ORANGE: ["E", "#EDB990"],
//   AMBER: ["F", "#F4D588"],
//   YELLOW: ["G", "#DDDF8E"],
//   CHARTREUSE: ["A", "#BAE58C"],
//   GREEN: ["C", "#A7E498"],
//   TEAL: ["D", "#96D9BC"],
//   BLUE: ["E", "#9CCCD9"],
//   VIOLET: ["G", "#ABBAD9"],
//   PURPLE: ["A", "#CFC0ED"],
//   MAGENTA: ["B", "#F0CEF3"],
// };

// Converts colors to notes using mapping above, and we attach the octave number
// based on order selected i.e. first notes selected is octave 2 etc.
export function convertColorsToNotes(selectedColors) {
  let notes = [];
  let octaveIndex = 2;
  for (const color of selectedColors) {
    let noteName = ColorNoteMapping[color][0];
    notes.push(noteName + octaveIndex.toString());
    octaveIndex++;
  }
  return notes;
}
