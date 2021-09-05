import { showCoordinates } from './coordinates.js';
import { coordsDelta } from './coordsDelta.js';
import { isNumber } from
'../../modules/isNumber.js';
import { PinchListener } from
'../../modules/components/PinchListener.js';

let settings;
let lastTouchPos;
let requestRenderFromWorker;

function touchEventToCoords(e) {
	if (e.touches.length !== 1)
		return;

	const touch = e.touches[0];
	return [touch.pageX, touch.pageY];
}

function handleTouchStart(e) {
	lastTouchPos = touchEventToCoords(e);
}

function handleTouchMove(e) {
	if (lastTouchPos !== undefined) {
		let m = touchEventToCoords(e);
		if (m === undefined)
			return;

		showCoordinates(m[0], m[1]);
		const delta = coordsDelta(lastTouchPos, m);
		if (delta !== undefined) {
			settings.cx -= delta[0] * settings.scale;
			settings.cy += delta[1] * settings.scale;
			requestRenderFromWorker();
		}
		lastTouchPos = m;
	}
}

function handleTouchEnd(e) {
	let m = touchEventToCoords(e);
	if (m === undefined)
		return;

	const delta = coordsDelta(lastTouchPos, m);
	if (delta !== undefined) {
		settings.cx -= delta[0] * settings.scale;
		settings.cy += delta[1] * settings.scale;
		requestRenderFromWorker();
	}
	lastTouchPos = undefined;
}

function handlePinch(scaleDelta) {
	if (isNumber(scaleDelta) && scaleDelta !== 0) {
		settings.scale /= scaleDelta;
		requestRenderFromWorker();
	}
}

export function initTouchListeners(settings_, requestRenderFromWorker_) {
	settings = settings_;
	requestRenderFromWorker = requestRenderFromWorker_;
	window.addEventListener('touchstart', handleTouchStart);
	window.addEventListener('touchmove', handleTouchMove);
	window.addEventListener('touchend', handleTouchEnd);
	PinchListener.bind(settings.canvas, handlePinch, false);
};