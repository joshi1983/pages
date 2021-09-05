import { DataType } from './DataType.js';
import { EasingFunction } from '../../drawing/vector/easing/EasingFunction.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

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
		if (!DataType.mayBeData(token))
			return false;
		if ([
			ParseTreeTokenType.BOOLEAN_LITERAL,
			ParseTreeTokenType.LIST,
			ParseTreeTokenType.NUMBER_LITERAL,
			ParseTreeTokenType.STRING_LITERAL,
			ParseTreeTokenType.LONG_STRING_LITERAL
		].indexOf(token.type) !== -1)
			return false;

		return true;
	}

	mayBeCompatibleWithValue(val) {
		return val instanceof EasingFunction;
	}

};