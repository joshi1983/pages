import { Model3D } from './Model3D.js';
import { Vector2DDrawing } from './Vector2DDrawing.js';
import { Vector2DLayer } from './Vector2DLayer.js';
import { VectorDrawing } from './VectorDrawing.js';

export class Vector3DDrawing extends VectorDrawing {
	constructor(otherDrawing) {
		super(otherDrawing);
		this.model = new Model3D();
		if (otherDrawing instanceof Vector3DDrawing)
			this.model.addShapes(otherDrawing.model);
		else if (otherDrawing instanceof Vector2DDrawing)
			this.model.addShapes(otherDrawing.getNonTurtleShapes());
	}

	addForegroundShape(shape) {
		super.addForegroundShape(shape);
		this.model.addShape(shape);
	}

	clearScreen() {
		super.clearScreen();
		this.model.clear();
	}

	getShapesArray() {
		return this.model.shapes;
	}

	hasAnythingToClear() {
		return super.hasAnythingToClear() || this.model.hasAnythingToClear();
	}
};