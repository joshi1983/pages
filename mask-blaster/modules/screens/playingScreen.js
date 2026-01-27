import { addListener, getMode, Modes, setMode } from '../Modes.js';
import { Masks } from './playing/Masks.js';
import { addPlayInputListener, removePlayInputListener } from
'./playing/playInputListener.js';
import { ready } from '../ready.js';
import { Score } from '../components/Score.js';
import { Shots } from './playing/Shots.js';
import { playSound, Sounds } from '../components/Sounds.js';

let canvas, context2D;
let width, height;
let oldTime, requestAnimationFrameId;
const viewpoint = {
	'x': 0,
	'y': 0
};
const INACTIVE = 0;
const PAUSED = 1;
const UNPAUSED_ACTIVE = 2;
let gameState = INACTIVE;

function resetViewPoint() {
	viewpoint.x = 0;
	viewpoint.y = 0;
}

function fillBlack() {
	context2D.fillStyle = 'black';
	context2D.fillRect(0, 0, width, height);
}

class GameInputHandler {
	static left(amount) {
		if (typeof amount !== 'number' || isNaN(amount))
			throw new Error(`amount must be a number but found ${amount}`);

		console.log('left ' + amount);
		viewpoint.x += amount;
	}

	static right(amount) {
		if (typeof amount !== 'number' || isNaN(amount))
			throw new Error(`amount must be a number but found ${amount}`);

		console.log('right ' + amount);
		viewpoint.x -= amount;
	}

	static shoot() {
		playSound(Sounds.SHOOT);
		Shots.shoot();
	}

	static togglePause() {
		if (gameState !== INACTIVE) {
			if (gameState === UNPAUSED_ACTIVE)
				gameState = PAUSED;
			else
				gameState = UNPAUSED_ACTIVE;
			if (gameState === UNPAUSED_ACTIVE)
				gameLoop();
			else
				pauseGame();
		}
	}
};

function pauseGame() {
	oldTime = undefined;
	if (requestAnimationFrameId !== undefined) {
		cancelAnimationFrame(requestAnimationFrameId);
		requestAnimationFrameId = undefined;
	}
}

function simulateTime(delta) {
	Masks.simulateTime(delta);
	Shots.simulateTime(delta);
}

function gameLoop() {
	if (gameState !== UNPAUSED_ACTIVE) {
		requestAnimationFrameId = undefined;
		return;
	}

	const newTime = Date.now();
	const delta = oldTime === undefined ? 0 : newTime - oldTime;
	simulateTime(delta);
	Score.increment();
	fillBlack();
	Masks.render(context2D, width, height, viewpoint);
	Shots.render(context2D, width, height, viewpoint);
	Score.render(context2D, width, height);

	if (Score.getNumber() > 200) {
		oldTime = undefined;
		gameState = INACTIVE;
		removePlayInputListener(GameInputHandler);
		setMode(Modes.GAME_OVER);
	}
	else {
		oldTime = newTime;
		if (getMode() === Modes.PLAYING)
			requestAnimationFrameId = requestAnimationFrame(gameLoop);
		else {
			gameState = INACTIVE;
			requestAnimationFrameId = undefined;
		}
	}
}

function refreshCanvasInfo() {
	canvas = document.querySelector('canvas');
	const box = canvas.getBoundingClientRect();
	canvas.setAttribute('width', Math.round(box.width));
	canvas.setAttribute('height', Math.round(box.height));
	context2D = canvas.getContext('2d');
	width = box.width;
	height = box.height;
}

addListener(function(mode) {
	if (mode === Modes.PLAYING) {
		resetViewPoint();
		Score.reset();
		Masks.reset();
		Shots.reset();
		refreshCanvasInfo();
		
		// make sure we don't activate the gameLoop more than once at a time.
		if (gameState === INACTIVE) {
			gameState = UNPAUSED_ACTIVE;
			gameLoop();
			addPlayInputListener(GameInputHandler);
		}
	}
	else {
		gameState = INACTIVE;
	}
});

function init() {
	window.addEventListener('resize', refreshCanvasInfo);
}

ready(init);