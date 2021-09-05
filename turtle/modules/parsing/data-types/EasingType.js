import { DataType } from './DataType.js';
import { EasingFunction } from '../../drawing/vector/easing/EasingFunction.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const possibleEasingTypes = new Set([
ParseTreeTokenType.PARAMETERIZED_GROUP,
ParseTreeTokenType.VARIABLE_READ
]);

/*
Represents the set of all easing functions supported by WebLogo.
*/
export class EasingType extends DataType {
	static helpUrl = 'easing.html';

	constructor() {
		super("easing");
	}

	getIntersectionWith(otherType) {
		if (otherType.name === 'easing')
			return otherType;
		return null;
	}

	intersectsWith(otherType) {
		return 'easing' === otherType.name;
	}

	mayBeCompatibleWith(token) {
		return possibleEasingTypes.has(token.type);
	}

	mayBeCompatibleWithValue(val) {
		return val instanceof EasingFunction;
	}

};