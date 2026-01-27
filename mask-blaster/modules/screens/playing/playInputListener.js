import { getMode, Modes } from '../../Modes.js';
import { ready } from '../../ready.js';

const listeners = [];
let lastDownPos;

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

const stepDistance = 0.1;

function eventToPos(event) {
	if (event.touches !== undefined && event.touches.length !== 0) {
		event = event.touches[0];
	}
	return {
		'x': event.clientX,
		'y': event.clientY
	};
}

function getDragScaleFactor() {
	return 10 / (window.innerWidth + window.innerHeight);
}

function displacement(pos1, pos2) {
	return {
		'x': pos1.x - pos2.x,
		'y': pos1.y - pos2.y
	};
}

function down(event) {
	if (getMode() !== Modes.PLAYING) {
		lastDownPos = undefined;
		return;
	}
	lastDownPos = eventToPos(event);
}

function move(event) {
	if (getMode() === Modes.PLAYING &&
	lastDownPos !== undefined) {
		const pos = eventToPos(event);
		const delta = displacement(lastDownPos, pos);
		dispatch('right', delta.x * getDragScaleFactor());
		dispatch('up', delta.y * getDragScaleFactor());
		lastDownPos = pos;
	}
	else
		lastDownPos = undefined;
}

function up(event) {
	if (getMode() === Modes.PLAYING &&
	lastDownPos !== undefined) {
		const pos = eventToPos(event);
		const delta = displacement(lastDownPos, pos);
		dispatch('right', delta.x * getDragScaleFactor());
		dispatch('up', delta.y * getDragScaleFactor());
	}
	lastDownPos = undefined;
}

// Pressing space should shoot.
// right and left arrow keys should move right and left.
// clicking should shoot.
// tapping the screen should shoot on touch screens.
// how to pause the game?
// 
function init() {
	window.addEventListener('keydown', function(event) {
		if (getMode() !== Modes.PLAYING)
			return;

		if (event.keyCode === 32 || event.key === ' ') {
			dispatch('shoot');
		}
		else if (event.keyCode === 37) {
			dispatch('left', stepDistance);
		}
		else if (event.keyCode === 38) {
			dispatch('up', stepDistance);
		}
		else if (event.keyCode === 39) {
			dispatch('right', stepDistance);
		}
		else if (event.keyCode === 40) {
			dispatch('up', -stepDistance);
		}
		else if (event.keyCode === 80) {
			dispatch('togglePause');
		}
	});
	window.addEventListener('click', function(event) {
		if (getMode() !== Modes.PLAYING)
			return;

		// ignore the click that changes mode.
		const target = event.target;
		if (target instanceof HTMLButtonElement)
			return;
		dispatch('shoot');
	});
	window.addEventListener('mousedown', down);
	window.addEventListener('mousemove', move);
	window.addEventListener('mouseup', up);
	window.addEventListener('touchstart', down);
	window.addEventListener('touchmove', move);
	window.addEventListener('touchcancel', up);
	window.addEventListener('touchend', up);
}

ready(init);