import { DataType } from './DataType.js';
import { NumberType } from './NumberType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export class IntegerType extends DataType {
	static helpUrl = 'integer.html';

	constructor() {
		super("int");
		this.mayBeCompatibleWithValue = IntegerType.mayBeCompatibleWithValue;
	}

	static mayBeCompatibleWithValue(val) {
		return Number.isInteger(val);
	}

	mayBeCompatibleWith(token) {
		return IntegerType.mayBeInt(token);
	}

	intersectsWith(otherType) {
		return NumberType.isIntersectingNumberTypes(this, otherType);
	}

	isProperSubsetOf(otherType) {
		return ['alphacolor', 'num', 'color'].indexOf(otherType.name) !== -1;
	}

	getIntersectionWith(otherType) {
		if (['color', 'int', 'num'].indexOf(otherType.name) !== -1)
			return this;
		return null;
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