import { Vector } from './Vector.js';

export class Vector2D extends Vector {
	constructor(...args) {
		super([0, 0]);
		if (arguments.length !== 0) {
			this.assign(...args);
		}
		for (let i = 0; i < 2; i++) {
			if (typeof this.coords[i] !== 'number' || isNaN(this.coords[i]))
				throw new Error('All coordinates must be numbers but non-number found at index ' + i + ' with value ' + this.coords[i]);
		}
	}

	assign() {
		if (arguments.length === 0)
			throw new Error('At least 1 argument is needed to assign new values to a Vector2D');
		if (arguments.length === 1) {
			if (arguments[0] instanceof Vector2D)
				this.coords = arguments[0].coords.slice(0);
			else if (arguments[0] instanceof Array && arguments[0].length === 2)
				this.coords = arguments[0].slice(0);
			else if (typeof arguments[0] === 'object' && arguments[0].coords instanceof Array && arguments[0].coords.length > 2)
				throw new Error('Unable to assign a Vector3D to a Vector2D');
			else {
				throw new Error('Invalid argument sent to Vector2D assign.  value = ' + arguments[0]);
			}
		}
		else if (arguments.length === 2) {
			if (typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
				this.coords[0] = arguments[0];
				this.coords[1] = arguments[1];
			}
			else
				throw new Error('When 2 arguments are passed, they must be numbers.  Actual values are ' + arguments[0] + ' and ' + arguments[1]);
		}
		else
			throw new Error('1 or 2 arguments expected but got ' + arguments.length);
	}

	static convert(v) {
		if (v instanceof Vector2D)
			return v;
		else
			return new Vector2D(v);
	}

	deepClone() {
		return new Vector2D(this);
	}

	getDisplacedByPolar(angleRadians, distance) {
		if (typeof angleRadians !== 'number' || isNaN(angleRadians))
			throw new Error('angleRadians must be a number');
		if (typeof distance !== 'number' || isNaN(distance))
			throw new Error('distance must be a number');

		return this.plus(Vector2D.createFromPolar(angleRadians, distance));
	}

	static createFromPolar(angleRadians, distance) {
		return new Vector2D(
			distance * Math.cos(angleRadians),
			distance * Math.sin(angleRadians)
		);
	}

	isZero() {
		return this.coords[0] === 0 && this.coords[1] === 0;
	}

	minus(otherVector) {
		if (otherVector.getZ !== undefined)
			return otherVector.multiply(-1).plus(this);

		otherVector = Vector2D.convert(otherVector);
		return new Vector2D(Vector.minusCoords(this.coords, otherVector.coords));
	}

	multiply(scaleFactor) {
		return new Vector2D(Vector.multiplyCoords(this.coords, scaleFactor));
	}

	plus(otherVector) {
		if (otherVector.getZ !== undefined)
			return otherVector.plus(this);

		otherVector = Vector2D.convert(otherVector);
		return new Vector2D(Vector.plusCoords(this.coords, otherVector.coords));
	}

	static rotateCoords(coords, angleRadians) {
		const cosA = Math.cos(angleRadians);
		const sinA = Math.sin(angleRadians);
		return [
			coords[0] * cosA - coords[1] * sinA,
			coords[1] * cosA + coords[0] * sinA
		];
	}

	static rotate(v, angleRadians) {
		return new Vector2D(Vector2D.rotateCoords(v.coords, angleRadians));
	}
};