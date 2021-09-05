import { DataType } from './DataType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { Transparent } from '../../Transparent.js';

export class TransparentType extends DataType {
	static helpUrl = 'transparent.html';

	constructor() {
		super("transparent");
	}

	isProperSubsetOf(otherType) {
		return false;
	}

	mayBeCompatibleWithValue(val) {
		return val === Transparent;
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

	getIntersectionWith(otherType) {
		if (otherType.name === this.name)
			return otherType;
		else
			return null;
	}
};