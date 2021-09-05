import { AbstractBoundingBox } from './AbstractBoundingBox.js';
import { Vector2D } from '../../drawing/vector/Vector2D.js';

export class BoundingBox2D extends AbstractBoundingBox {
	constructor(includedObjects) {
		if (includedObjects !== undefined && !(includedObjects instanceof Array))
			throw new Error('includedObjects must either be undefined or an Array');

		super();
		this.radius = undefined;
		this.min = new Vector2D(Number.MAX_VALUE, Number.MAX_VALUE);
		this.max = new Vector2D(-Number.MAX_VALUE, -Number.MAX_VALUE);
		if (includedObjects !== undefined) {
			const outer = this;
			includedObjects.forEach(function(includedObject) {
				outer.include(includedObject);
			});
		}
	}

	getAverageDimension() {
		return ((this.max.getY() - this.min.getY()) + (this.max.getX() - this.min.getX())) * 0.5;
	}

	getCentre() {
		return this.max.plus(this.min).multiply(0.5);
	}

	include(other) {
		if (other instanceof Vector2D) {
			this.includeCoord(0, other.getX());
			this.includeCoord(1, other.getY());
		}
		else if (other instanceof BoundingBox2D) {
			this.include(other.min);
			this.include(other.max);
		}
		else if (other instanceof Array) {
			other.forEach(v => this.include(v));
		}
		else
			throw new Error('other must be a Vector2D or a BoundingBox2D.  Not: ' + other);
	}

	includeCoord(coordIndex, num) {
		if (typeof num !== 'number' || isNaN(num))
			throw new Error('num must be a number.  Not: ' + num);
		if (typeof coordIndex !== 'number' || isNaN(coordIndex) || coordIndex < 0 || coordIndex > 1 || !Number.isInteger(coordIndex))
			throw new Error('coordIndex must be 0, or 1.  Not: ' + coordIndex);
		this.min.coords[coordIndex] = Math.min(this.min.coords[coordIndex], num);
		this.max.coords[coordIndex] = Math.max(this.max.coords[coordIndex], num);
		this.radius = undefined; // clear radius cache because it may have changed.
	}
};