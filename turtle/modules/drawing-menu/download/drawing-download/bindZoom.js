import { addZoomMenuItems } from '../bindZoomItemsToViewer.js';
let zoomIn, zoomOut, nudgeIn, nudgeOut;
const callbacks = [];

function addCallback(callback) {
	callbacks.push(callback);
	return callback; // return for chained calls
}

export function bindZoom(transformer) {
	addZoomMenuItems('drawing-previewer-');
	zoomIn = document.getElementById('drawing-previewer-zoom-in');
	zoomOut = document.getElementById('drawing-previewer-zoom-out');
	nudgeIn = document.getElementById('drawing-previewer-nudge-in');
	nudgeOut = document.getElementById('drawing-previewer-nudge-out');
	const zoomFactor = 1.1;
	const nudgeFactor = 1.01;
	zoomIn.addEventListener('click', addCallback(function() {
		transformer.multiplyScaleBy(zoomFactor);
	}));
	zoomOut.addEventListener('click', addCallback(function() {
		transformer.multiplyScaleBy(1/zoomFactor);
	}));
	nudgeIn.addEventListener('click', addCallback(function() {
		transformer.multiplyScaleBy(nudgeFactor);
	}));
	nudgeOut.addEventListener('click', addCallback(function() {
		transformer.multiplyScaleBy(1/nudgeFactor);
	}));
};

export function unbindZoom() {
	const elements = [zoomIn, zoomOut, nudgeIn, nudgeOut];
	callbacks.forEach(function(callback) {
		elements.forEach(function(element) {
			element.removeEventListener('click', callback);
		});
	});
	callbacks.length = 0;
};