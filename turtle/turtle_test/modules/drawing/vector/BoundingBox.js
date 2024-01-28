import { Vector } from './Vector.js';
import { Vector3D } from './Vector3D.js';

export class BoundingBox {
	constructor(includedObjects) {
		if (includedObjects !== undefined && !(includedObjects instanceof Array))
			throw new Error('includedObjects must either be undefined or an Array');

		this.min = new Vector3D(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
		this.max = new Vector3D(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
		if (includedObjects !== undefined) {
			const outer = this;
			includedObjects.forEach(function(includedObject) {
				outer.include(includedObject);
			});
		}
	}

	// makes this box fit within the specified box.
	confineWithin(box) {
		for (let i = 0; i < 3; i++) {
			this.max.coords[i] = Math.min(this.max.coords[i], box.max.coords[i]);
			this.min.coords[i] = Math.max(this.min.coords[i], box.min.coords[i]);
		}
	}

	static createCubeBox(centre, radius) {
		if (typeof radius !== 'number')
			throw new Error('radius must be a number');
		const result = new BoundingBox();
		result.include(centre.minus(new Vector3D(radius, radius, radius)));
		result.include(centre.plus(new Vector3D(radius, radius, radius)));
		return result;
	}

	static createZSquare(centre, radius) {
		if (typeof radius !== 'number')
			throw new Error('radius must be a number');
		const result = BoundingBox.createCubeBox(centre, radius);
		const threshold = Math.min(radius, 0.0001);
		result.max.setZ(centre.getZ() + threshold);
		result.min.setZ(centre.getZ() - threshold);
		return result;
	}

	getAverageDimensionXY() {
		return ((this.max.getX() - this.min.getX()) +
			(this.max.getY() - this.min.getY())) * 0.5;
	}

	getAverageX() {
		return this.getCoordAverage(0);
	}

	getAverageY() {
		return this.getCoordAverage(1);
	}

	getCoordAverage(coordinateIndex) {
		return (this.min.coords[coordinateIndex] + this.max.coords[coordinateIndex]) * 0.5;
	}

	getCentre() {
		return this.min.plus(this.max).multiply(0.5);
	}

	getMaxDimensionSize() {
		let result = 0;
		for (let i = 0; i < 3; i++) {
			result = Math.max(result, this.max.coords[i] - this.min.coords[i]);
		}
		return result;
	}

	include(other) {
		if (other instanceof Vector) {
			this.includeCoord(0, other.getX());
			this.includeCoord(1, other.getY());
			if (other instanceof Vector3D)
				this.includeCoord(2, other.getZ());
		}
		else if (other instanceof BoundingBox) {
			this.include(other.min);
			this.include(other.max);
		}
	}

	includeCoord(coordIndex, num) {
		if (typeof num !== 'number' || isNaN(num))
			throw new Error('num must be a number.  Not: ' + num);
		if (typeof coordIndex !== 'number' || isNaN(coordIndex) || coordIndex < 0 || coordIndex > 2 || !Number.isInteger(coordIndex))
			throw new Error('coordIndex must be 0, 1, or 2.  Not: ' + coordIndex);
		this.min.coords[coordIndex] = Math.min(this.min.coords[coordIndex], num);
		this.max.coords[coordIndex] = Math.max(this.max.coords[coordIndex], num);
	}

	toPathVectors() {
		const indexes = [
			[0, 0, 0],
			[0, 0, 1],
			[0, 1, 1],
			[0, 1, 0],
			[0, 0, 0],
			[1, 0, 0],
			[1, 1, 0],
			[1, 1, 1],
			[1, 0, 1],
			[1, 0, 0]
		];
		const minMax = [this.min, this.max];
		return indexes.map(function(tuple) {
			const zIndex = tuple[0];
			const yIndex = tuple[1];
			const xIndex = tuple[2];
			return new Vector3D(minMax[xIndex].getX(), minMax[yIndex].getY(), minMax[zIndex].getZ());
		});
	}
}