import { clamp } from
'../../modules/clamp.js';
import { showCoordinates } from './coordinates.js';
import { coordsDelta } from './coordsDelta.js';
import { isNumber } from
'../../modules/isNumber.js';

let settings;
let lastMousePos;
let requestRenderFromWorker;

function handleMouseWheel(e) {
	const scaleOffset = clamp(e.deltaY * 0.001, -0.5, 0.5);
	if (isNumber(scaleOffset) && scaleOffset !== 0) {
		const newScale = settings.scale * (1 + scaleOffset);
		if (newScale > 0) {
			settings.scale = newScale;
			requestRenderFromWorker();
		}
	}
}

function mouseEventToCoords(e) {
	if (isNumber(e.pageX) && isNumber(e.pageY))
		return [e.pageX, e.pageY];
}

function handleMouseDown(e) {
	lastMousePos = mouseEventToCoords(e);
}

function handleMouseMove(e) {
	let m = mouseEventToCoords(e);
	if (m === undefined)
		return;

	showCoordinates(m[0], m[1]);
	if (lastMousePos !== undefined) {
		const delta = coordsDelta(lastMousePos, m);
		if (delta !== undefined) {
			settings.cx -= delta[0] * settings.scale;
			settings.cy += delta[1] * settings.scale;
			requestRenderFromWorker();
		}
		lastMousePos = m;
	}
}

function handleMouseUp(e) {
	let m = mouseEventToCoords(e);
	if (m === undefined)
		return;

	const delta = coordsDelta(lastMousePos, m);
	if (delta !== undefined) {
		settings.cx -= delta[0] * settings.scale;
		settings.cy += delta[1] * settings.scale;
		requestRenderFromWorker();
	}
	lastMousePos = undefined;
}

export function initMouseListeners(settings_, requestRenderFromWorker_) {
	settings = settings_;
	requestRenderFromWorker = requestRenderFromWorker_;
	window.addEventListener('mousedown', handleMouseDown);
	window.addEventListener('mousemove', handleMouseMove);
	window.addEventListener('mouseup', handleMouseUp);
	window.addEventListener('wheel', handleMouseWheel);
};