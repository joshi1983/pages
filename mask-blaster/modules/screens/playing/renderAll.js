import { drawBackgroundGrid } from './drawBackgroundGrid.js';
import { explosions } from './Explosions.js';
import { masks } from './Masks.js';
import { shots } from './Shots.js';

function fillAll(context2D, width, height, fillColor) {
	context2D.fillStyle = fillColor;
	context2D.fillRect(0, 0, width, height);
}

function compareByZ(obj1, obj2) {
	return obj2.z - obj1.z;
}

export function renderAll(context2D, width, height, viewpoint, fillColor) {
	const objects = masks.concat(shots).concat(explosions);
	fillAll(context2D, width, height, fillColor);
	drawBackgroundGrid(context2D, width, height, viewpoint);
	// sort by z.
	objects.sort(compareByZ);
	// draw from maximum z to minimum z.
	for (const object of objects) {
		object.render(context2D, width, height, viewpoint);
	}
};