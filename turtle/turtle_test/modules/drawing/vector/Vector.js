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

	static coordsEqualEnough(coords1, coords2, toleranceThreshold) {
		if (coords1.length !== coords2.length)
			return false;
		if (toleranceThreshold === undefined)
			toleranceThreshold = coordsEqualEnoughTolerance;
		for (let i = 0; i < coords1.length; i++) {
			if (coords1[i] !== coords2[i] && Math.abs(coords1[i] - coords2[i]) > toleranceThreshold)
				return false;
		}
		return true;
	}

	/*
	Notice that val1 and val2 must be Arrays of numbers.
	They're not expected to be Vector instances.
	*/
	static dotProduct(val1, val2) {
		let result = 0;
		for (let i = 0; i < val1.length; i++) {
			result += val1[i] * val2[i];
		}
		return result;
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
		// Math.hypot(...coords1) is worth considering to use here.
		// A reason not to use hypot would be if coords1.length could be too big 
		// like over 60,000 which would lead to an exception due to limitations of the ... operator.
		// It would be worth testing hypot for execution speed, though.  
		// If hypot performed much faster when coords1.length was small enough, it would be worth using instead in some cases.
		return Math.sqrt(Vector.sumOfSquares(coords1));
	}

	static sumOfSquares(coords1) {
		if (coords1.coords instanceof Array)
			coords1 = coords1.coords;

		let sum = 0;
		for (let i = 0; i < coords1.length; i++) {
			const v = coords1[i];
			sum += v * v;
		}
		return sum;
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