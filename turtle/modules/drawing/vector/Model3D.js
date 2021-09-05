import { Shape } from './shapes/Shape.js';

export class Model3D {
	constructor() {
		this.clear();
	}

	addShape(shape) {
		if (!(shape instanceof Shape))
			throw new Error('shape must be an instance of Shape');

		this.shapes.push(shape);
	}

	addShapes(shapes) {
		if (shapes instanceof Model3D)
			shapes = shapes.shapes;
		if (!(shapes instanceof Array))
			throw new Error('shapes must be an Array or a Model3D');
		const outer = this;
		shapes.forEach(function(shape) {
			outer.addShape(shape);
		});
	}

	clear() {
		this.shapes = [];
	}

	hasAnythingToClear() {
		return this.shapes.length !== 0;
	}
};