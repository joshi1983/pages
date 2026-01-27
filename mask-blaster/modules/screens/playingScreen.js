import { addListener, getMode, Modes, setMode } from '../Modes.js';
import { drawGunSight } from './playing/drawGunSight.js';
import { Explosions } from './playing/Explosions.js';
import { Masks } from './playing/Masks.js';
import { pick } from '../pick.js';
import { addPlayInputListener, removePlayInputListener } from
'./playing/playInputListener.js';
import { ready } from '../ready.js';
import { renderAll } from './playing/renderAll.js';
import { Score } from '../components/Score.js';
import { Shots } from './playing/Shots.js';
import { playSound, Sounds, stopSound } from '../components/Sounds.js';

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
let lastMissTime;
const maxRecordedMissTime = 1000;

function resetViewPoint() {
	viewpoint.x = 0;
	viewpoint.y = 0;
}

function processMissedMask() {
	lastMissTime = 0;
	Score.decrement();
	playSound(pick([Sounds.SCREAM1, Sounds.SCREAM2]));
}

function enforceViewpointLimits() {
	const r = Math.hypot(viewpoint.x, viewpoint.y);
	if (r > 2) {
		viewpoint.x = viewpoint.x * 2 / r;
		viewpoint.y = viewpoint.y * 2 / r;
	}
}

class GameInputHandler {
	static left(amount) {
		if (typeof amount !== 'number' || isNaN(amount))
			throw new Error(`amount must be a number but found ${amount}`);

		viewpoint.x += amount;
		enforceViewpointLimits();
	}

	static right(amount) {
		if (typeof amount !== 'number' || isNaN(amount))
			throw new Error(`amount must be a number but found ${amount}`);

		viewpoint.x -= amount;
		enforceViewpointLimits();
	}

	static shoot() {
		playSound(Sounds.SHOOT);
		Shots.shoot(viewpoint.x, viewpoint.y - 0.05);
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

	static up(amount) {
		if (typeof amount !== 'number' || isNaN(amount))
			throw new Error(`amount must be a number but found ${amount}`);

		viewpoint.y -= amount;
		enforceViewpointLimits();
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
	if (lastMissTime !== undefined) {
		lastMissTime += delta;
		if (lastMissTime > maxRecordedMissTime)
			lastMissTime = undefined;
	}
	Explosions.simulateTime(delta);
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

	let fillColor = 'black';
	if (lastMissTime !== undefined)
		fillColor = `rgb(${Math.floor(255 * (1 - lastMissTime / maxRecordedMissTime))}, 0, 0)`;

	renderAll(context2D, width, height, viewpoint, fillColor);
	Score.render(context2D, width, height);
	drawGunSight(context2D, width, height);

	if (Score.getNumber() < 0 || Score.getNumber() > 50) {
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
		Explosions.reset();
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
		lastMissTime = undefined;
		stopSound(Sounds.SCREAM1);
		stopSound(Sounds.SCREAM2);
		gameState = INACTIVE;
	}
});

function init() {
	window.addEventListener('resize', refreshCanvasInfo);
	Masks.addMaskMissListener(processMissedMask);
}

ready(init);