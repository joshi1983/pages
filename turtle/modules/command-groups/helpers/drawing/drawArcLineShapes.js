import { drawArcLineShape } from './drawArcLineShape.js';

/*
Similar to some WebLogo code in the corresponding example.
*/
export function drawArcLineShapes(turtle, shapes, scale) {
	for (let i = 0; i < shapes.length; i++) {
		const shape = shapes[i];
		drawArcLineShape(turtle, shape, scale);
	}
};