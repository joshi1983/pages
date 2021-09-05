import { initCoordinates } from './coordinates.js';
import { help } from './help.js';
import { initMouseListeners } from './initMouseListeners.js';
import { initTouchLayout } from './initTouchLayout.js';
import { initTouchListeners } from './initTouchListeners.js';
import { initWorker, requestRenderFromWorker } from './requestRenderFromWorker.js';
import { initZoomMenu } from './initZoomMenu.js';
import { ready } from
'../../modules/ready.js';
const settings = {};

function updateCanvasSize() {
	const bounds = settings.canvas.getBoundingClientRect();
	const w = Math.floor(bounds.width);
	const h = Math.floor(bounds.height);
	if (w !== settings.canvas.width || h !== settings.canvas.height) {
		settings.canvas.setAttribute('width', w);
		settings.canvas.setAttribute('height', h);
		requestRenderFromWorker();
	}
}

function zoomReset() {
	settings.scale = 0.01;
	settings.cx = 0;
	settings.cy = 0;
}

function refreshCanvas() {
	settings.canvas = document.querySelector('canvas');
	zoomReset();
	
	initWorker(settings);
	initMouseListeners(settings, requestRenderFromWorker);
	initTouchListeners(settings, requestRenderFromWorker);
	initZoomMenu(settings, requestRenderFromWorker, function() {
		zoomReset();
		requestRenderFromWorker();
	});
	window.addEventListener('resize', updateCanvasSize);
	updateCanvasSize();
	initTouchLayout();
	help();
	initCoordinates(settings);
}

ready(refreshCanvas);