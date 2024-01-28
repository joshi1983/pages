import { Camera } from '../Camera.js';
import { ShapeStyle } from './style/ShapeStyle.js';
import { Vector } from '../Vector.js';

// A shape may be 2D or 3D.
// The subclass Shape3D is for strictly 3D shapes.
export class Shape {
	constructor(position, style) {
		if (style === undefined)
			style = new ShapeStyle();
		else if (!(style instanceof ShapeStyle))
			style = new ShapeStyle(style);
		if (!(position instanceof Vector))
			throw new Error('position must be a Vector');

		this.style = style;
		this.position = position;
	}

	clone() {
		return this.transformBy(new Camera());
	}

	// to be called only when this shape stops being used
	// helps JavaScript's garbage collector recognize objects are safe to free out of RAM.
	disconnect() {
		this.style.disconnect();
		this.style = undefined;
		this.position = undefined;
	}

	getBoundingBox() {
		throw new Error('getBoundingBox not implemented yet in this subclass of Shape');
	}

	isTainted() {
		return false;
	}

	transformBy(camera) {
		throw new Error('transformBy not implemented yet in this subclass of Shape');
	}
};