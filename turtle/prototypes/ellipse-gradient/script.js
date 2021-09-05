import { fillPolygon } from './fillPolygon.js';
import { original } from './original.js';
import { ready } from '../../modules/ready.js';

const buttonsMap = new Map([
	['fill-polygon', fillPolygon],
	['original', original]
]);

function getCanvas() {
	return document.getElementById("test-canvas");
}

function draw() {
	const cnv = getCanvas();
	original(cnv);
}

function drawOnCanvas(handler) {
	const canvas = getCanvas();
	return function() {
		const box = canvas.getBoundingClientRect();
		canvas.setAttribute('width', Math.round(box.width));
		canvas.setAttribute('height', Math.round(box.height));

		handler(canvas);
	};
}

function init() {
	draw();
	for (const [id, handler] of buttonsMap) {
		const e = document.getElementById(id);
		if (e === null)
			console.error(`Unable to find element with id ${id}.  Expected to find a button.`);
		else {
			e.addEventListener('click', drawOnCanvas(handler));
		}
	}
}

ready(init);