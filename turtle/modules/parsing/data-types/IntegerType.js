import { DataType } from './DataType.js';
import { NumberType } from './NumberType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export class IntegerType extends DataType {
	static helpUrl = 'integer.html';

	constructor() {
		super("int");
		this.mayBeCompatibleWithValue = IntegerType.mayBeCompatibleWithValue;
	}

	intersectsWith(otherType) {
		return NumberType.isIntersectingNumberTypes(this, otherType);
	}

	static isDefinitelyCompatibleWith(token) {
		if (token.type !== ParseTreeTokenType.NUMBER_LITERAL)
			return false;
		return Number.isInteger(token.val);
	}

	isProperSubsetOf(otherType) {
		if (otherType.name === 'num') {
			if (otherType.isUnfiniteOnly ||
			otherType.min !== -Infinity)
				return false;

			return true;
		}
		return ['alphacolor', 'color'].indexOf(otherType.name) !== -1;
	}

	getIntersectionWith(otherType) {
		if (otherType.name === 'num') {
			if (otherType.isUnfiniteOnly)
				return null; // Infinity and -Infinity are not considered integers.
			return this;
				// FIXME: if/when IntegerType supports min, that should be factored into this intersection.
		}
		if (['color', 'int'].indexOf(otherType.name) !== -1)
			return this;
		return null;
	}

	static mayBeCompatibleWithValue(val) {
		return Number.isInteger(val);
	}

	mayBeCompatibleWith(token) {
		return IntegerType.mayBeInt(token);
	}

	static mayBeInt(token) {
		if (!DataType.mayBeData(token))
			return false;
		if (NumberType.isDefinitelyNotCompatibleWith(token))
			return false;
		if (token.type === ParseTreeTokenType.NUMBER_LITERAL &&
		!Number.isInteger(token.val))
			return false;

		return true;
	}
}