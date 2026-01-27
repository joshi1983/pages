import { ready } from './ready.js';

const listeners = [];

function dispatch(key) {
	const args = Array.from(arguments);
	const laterArgs = args.slice(1);
	for (const listener of listeners) {
		listener[key](...laterArgs);
	}
}

export function removePlayInputListener(listener) {
	const index = listeners.indexOf(listener);
	if (index === -1)
		throw new Error(`Unable to remove listener because it was not found in listeners array`);

	listeners.splice(index, 1);
};

export function addPlayInputListener(listener) {
	listeners.push(listener);
};

const stepDistance = 0.2;

// Pressing space should shoot.
// right and left arrow keys should move right and left.
// clicking should shoot.
// tapping the screen should shoot on touch screens.
// how to pause the game?
// 
function init() {
	window.addEventListener('keydown', function(event) {
		if (event.keyCode === 32 || event.key === ' ') {
			dispatch('shoot');
		}
		else if (event.keyCode === 37) {
			dispatch('left', stepDistance);
		}
		else if (event.keyCode === 39) {
			dispatch('right', stepDistance);
		}
		else if (event.keyCode === 80) {
			dispatch('togglePause');
		}
	});
}

ready(init);