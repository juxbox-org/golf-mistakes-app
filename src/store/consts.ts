// Mistake results:
export const LONG = 1;
export const SHORT = 2;
export const LEFT = 4;
export const RIGHT = 8;
export const SLICE = 16;
export const HOOK = 32;
export const FAT = 64;
export const THIN = 128;
export const TOP = 256;
export const SHANK = 512;
export const RESULTS_MAP = new Map<string, number>([
  ['long', LONG],
  ['short', SHORT],
  ['left', LEFT],
  ['right', RIGHT],
  ['slice', SLICE],
  ['hook', HOOK],
  ['fat', FAT],
  ['thin', THIN],
  ['top', TOP],
  ['shank', SHANK],
]);

// Swings types:
export const FULL_SWING = 0;
export const HALF_SWING = 1;
export const PITCH_SWING = 2;
export const PUNCH_SWING = 3;
export const SWING_NAMES = [
  'Full', 'Half', 'Pitch', 'Punch',
];
