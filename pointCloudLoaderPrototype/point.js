class Point {
	constructor(coords, r, g, b) {
		if (!coords instanceof Array)
			throw new Error('coords must be an Array');
		if (coords.length !== 3)
			throw new Error('coords must have length 3');
		this._validateNumber(r, 'r');
		this._validateNumber(g, 'g');
		this._validateNumber(b, 'b');
		this.coords = coords;
		this.r = r;
		this.g = g;
		this.b = b;
	}

	_validateNumber(v, key) {
		if (typeof v !== 'number' || isNaN(v))
			throw new Error(key + ' must be a number.  Not: ' + v);
	}
}