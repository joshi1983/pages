import { isNumber } from '../../isNumber.js';
import { Vector2D } from './Vector2D.js';
import { Vector } from './Vector.js';

export class Vector3D extends Vector {
	constructor() {
		super([0, 0, 0]);
		if (arguments.length === 1) {
			this.assign(arguments[0]);
		}
		else if (arguments.length === 3) {
			this.coords = [arguments[0], arguments[1], arguments[2]];
		}
		else if (arguments.length !== 0)
			throw new Error('Unsupported number of arguments.  0, 1, or 3 supported but not ' + arguments.length);
		for (let i = 0; i < 3; i++) {
			if (typeof this.coords[i] !== 'number' || isNaN(this.coords[i]))
				throw new Error('All coordinates must be numbers but non-number found at index ' + i + ' with value ' + this.coords[i]);
		}
	}

	assign(obj) {
		if (obj instanceof Array) {
			if (obj.length === 3)
				this.coords = obj.slice(0);
			else if (obj.length === 2) {
				this.coords = obj.slice(0);
				this.coords.push(0);
			}
			else
				throw new Error('Invalid array length.  2 or 3 expected but got ' + obj.length);
		}
		else if (obj instanceof Vector3D)
			this.coords = obj.coords.slice(0); // make copy to avoid unintentional mutations of the other vector's coordinates.
		else if (obj instanceof Vector2D) {
			this.coords = obj.coords.slice(0);
			this.coords.push(0); // initialize the 3rd coordinate(z) to 0.
		}
		else
			throw new Error('Unable to assign Vector3D from the specified argument.  Array, Vector2D, or Vector3D required');
	}

	static createFromPolar(angleRadians, distance) {
		if (typeof angleRadians !== 'number' || isNaN(angleRadians))
			throw new Error('angleRadians must be a number');
		if (typeof distance !== 'number' || isNaN(distance))
			throw new Error('distance must be a number');

		return new Vector3D(
			distance * Math.cos(angleRadians),
			distance * Math.sin(angleRadians),
			0
		);
	}

	static cross(a, b) {
		return new Vector3D(
			a.coords[1] * b.coords[2] - a.coords[2] * b.coords[1],
			a.coords[2] * b.coords[0] - a.coords[0] * b.coords[2],
			a.coords[0] * b.coords[1] - a.coords[1] * b.coords[0]
		);
	}

	getDisplacedByPolar(angleRadians, distance) {
		if (typeof angleRadians !== 'number' || isNaN(angleRadians))
			throw new Error('angleRadians must be a number');
		if (typeof distance !== 'number' || isNaN(distance))
			throw new Error('distance must be a number');

		return this.plus(Vector3D.createFromPolar(angleRadians, distance));
	}

	getXYVector() {
		return new Vector2D(this.coords[0], this.coords[1]);
	}

	getZ() {
		return this.coords[2];
	}

	isZero() {
		return this.coords[0] === 0 && this.coords[1] === 0 && this.coords[2] === 0;
	}

	minus(otherVector) {
		if (otherVector instanceof Vector2D)
			otherVector = new Vector3D(otherVector);
		let otherCoords = undefined;
		if (otherVector instanceof Array)
			otherCoords = otherVector;
		else
			otherCoords = otherVector.coords;
		return new Vector3D(Vector.minusCoords(this.coords, otherCoords));
	}

	multiply(scalar) {
		if (!isNumber(scalar))
			throw new Error(`scalar must be a number.  Not ${scalar}`);

		return new Vector3D(Vector.multiplyCoords(this.coords, scalar));
	}

	static normalize(v) {
		const m = v.magnitude();
		if (m === 0)
			return new Vector3D(0, 0, 1); // avoid division by 0.

		return v.multiply(1/m);
	}

	plus(otherVector) {
		if (otherVector instanceof Vector2D)
			otherVector = new Vector3D(otherVector);
		return new Vector3D(Vector.plusCoords(this.coords, otherVector.coords));
	}

	setZ(newZ) {
		if (isNaN(newZ))
			throw new Error('z must be a number');
		this.coords[2] = newZ;
	}
};