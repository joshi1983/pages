import { Vector } from './Vector.js';

export class AbstractBoundingBox {
	getRadius() {
		if (this.radius === undefined)
			this.radius = Vector.euclideanDistance(this.max.minus(this.min)) * 0.5;
		return this.radius;
	}
};