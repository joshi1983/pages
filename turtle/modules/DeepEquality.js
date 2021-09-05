import { equalWithinThreshold } from './equalWithinThreshold.js';
import { isNumber } from './isNumber.js';

export class DeepEquality {
	static equals(v1, v2, tolerance) {
		if ((typeof v1) !== (typeof v2))
			return false;
		else if (v1 === undefined)
			return true;
		else if (typeof v1 === 'number' && typeof v2 === 'number' &&
		isNaN(v1) && isNaN(v2))
			return true;
		else if (typeof v1 === 'object')
			return DeepEquality.objectsEqual(v1, v2, tolerance);
		else if (isNumber(v1) !== isNumber(v2))
			return false;
		else if (isNumber(tolerance) && isNumber(v1))
			return equalWithinThreshold(v1, v2, tolerance);
		else
			return v1 === v2;
	}

	static arraysEqual(a1, a2, tolerance) {
		if (a1.length !== a2.length)
			return false;
		for (var i = 0; i < a1.length; i++)
			if (!DeepEquality.equals(a1[i], a2[i], tolerance))
				return false;
		
		return true;
	}

	static objectsEqual(o1, o2, tolerance) {
		if ((o1 === null) !== (o2 === null))
			return false;
		if (o1 === null)
			return true;
		if ((o1 instanceof Array) !== (o2 instanceof Array))
			return false;
		if (o1 instanceof Array) {
			return DeepEquality.arraysEqual(o1, o2, tolerance);
		}
		if (o1 instanceof Map) {
			if (!(o2 instanceof Map))
				return false;
			else if (o1.size !== o2.size)
				return false;
			else
				return DeepEquality.arraysEqual(Array.from(o1.keys()), Array.from(o2.keys()), tolerance) &&
					DeepEquality.arraysEqual(Array.from(o1.values()), Array.from(o2.values()), tolerance);
		}
		const keys1 = Object.keys(o1);
		const keys2 = Object.keys(o2);
		if (keys1.length !== keys2.length)
			return false;
		for (var key of keys1) {
			if (!DeepEquality.equals(o1[key], o2[key], tolerance))
				return false;
		}
		return true;
	}
};