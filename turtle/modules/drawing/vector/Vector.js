const coordsEqualEnoughTolerance = 0.000001;

export class Vector {
	constructor(coords) {
		this.coords = coords;
	}

	static coordsEqual(coords1, coords2) {
		if (coords1.length !== coords2.length)
			return false;
		for (let i = 0; i < coords1.length; i++) {
			if (coords1[i] !== coords2[i])
				return false;
		}
		return true;
	}

	static coordsEqualEnough(coords1, coords2) {
		if (coords1.length !== coords2.length)
			return false;
		for (let i = 0; i < coords1.length; i++) {
			if (coords1[i] !== coords2[i] && Math.abs(coords1[i] - coords2[i]) > coordsEqualEnoughTolerance)
				return false;
		}
		return true;
	}

	equals(v) {
		if (typeof v !== 'object' || !(v.coords instanceof Array))
			return false;
		return Vector.coordsEqual(this.coords, v.coords);
	}

	equalsCloseEnough(v) {
		if (typeof v !== 'object' || !(v.coords instanceof Array))
			return false;
		return Vector.coordsEqualEnough(this.coords, v.coords);
	}

	// coords1 must be an Array of numbers
	static euclideanDistance(coords1) {
		if (coords1.coords instanceof Array)
			coords1 = coords1.coords;

		let sum = 0;
		for (let i = 0; i < coords1.length; i++) {
			const v = coords1[i];
			sum += v * v;
		}
		return Math.sqrt(sum);
	}

	getX() {
		return this.coords[0];
	}

	getY() {
		return this.coords[1];
	}

	magnitude() {
		return Vector.euclideanDistance(this.coords);
	}

	static minusCoords(coords1, coords2) {
		if (!(coords1 instanceof Array))
			throw new Error('coords1 must be an Array');
		if (!(coords2 instanceof Array))
			throw new Error('coords2 must be an Array');
		if (coords1.length !== coords2.length)
			throw new Error('The lengths must be equal but they are not. ' + coords1.length + ' is not ' + coords2.length);
		const result = [];
		for (let i = 0; i < coords1.length; i++)
			result.push(coords1[i] - coords2[i]);
		return result;
	}

	static multiplyCoords(coords, scaleFactor) {
		if (isNaN(scaleFactor) || typeof scaleFactor !== 'number')
			throw new Error('scaleFactor must be a number');
		return coords.map(v => v * scaleFactor);
	}

	static plusCoords(coords1, coords2) {
		const result = [];
		for (let i = 0; i < coords1.length; i++)
			result.push(coords1[i] + coords2[i]);
		return result;
	}

	setX(newX) {
		if (isNaN(newX))
			throw new Error('x must be a number');
		this.coords[0] = newX;
	}

	setY(newY) {
		if (isNaN(newY))
			throw new Error('y must be a number');
		this.coords[1] = newY;
	}

	toArray() {
		return this.coords.slice(0); 
		// return a copy to prevent the caller from mutating this vector's coordinates.
	}

	toString() {
		return JSON.stringify(this.coords);
	}

};