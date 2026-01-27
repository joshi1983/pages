// The Modes module handles the mode the UI is in.
// Various other modules listen to state changes, read the state and mutate the state.
//
// A lot of this code is working around how JavaScript doesn't support enum's natively.


const names = [
	'INIT', 'CONTROLS', 'PLAYING', 'GAME_OVER'
];

export class Modes {
	static getNameFor(intMode) {
		return names[intMode];
	}
};
for (let i = 0; i < names.length; i++) {
	Modes[names[i]] = i;
}

let mode = Modes.INIT;
const listeners = [];

export function getMode() {
	return mode;
};

export function setMode(newMode) {
	if (!Number.isInteger(newMode) || newMode < 0 || newMode >= names.length)
		throw new Error(`newMode must be an integer in 0..${names.length - 1} but found ${newMode}`);

	if (mode === newMode)
		return; // no change to the mode so no need to continue here.

	mode = newMode;
	for (const listener of listeners) {
		listener(newMode);
	}
};

export function addListener(listener) {
	listeners.push(listener);
};