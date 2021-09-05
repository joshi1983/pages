import { DeepEquality } from '../../modules/DeepEquality.js';

export function isCloseEnough(val1, val2, tolerance) {
	if (val1 === undefined)
		val1 = null;
	if (val2 === undefined)
		val2 = null;
	if (typeof val1 === 'number') {
		if (typeof val2 === 'number') {
			if (tolerance === undefined)
				tolerance = 0.00001;
			return Math.abs(val1 - val2) < tolerance;
			// exact equality checks don't tolerate floating point error well enough.
		}
		else
			return false; // a number is not close enough to a non-number.
	}
	if (val1 instanceof Array) {
		if (val2 instanceof Array) {
			if (val1.length !== val2.length)
				return false;
			else {
				for (let i = 0; i < val1.length; i++) {
					if (!isCloseEnough(val1[i], val2[i], tolerance))
						return false;
				}
				return true;
			}
		}
		else
			return false; // an Array isn't close to a non-array.
	}
	if (DeepEquality.equals(val1, val2))
		return true;
	return false;
};