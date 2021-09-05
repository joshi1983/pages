import { DataType } from './DataType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export class TransparentType extends DataType {
	static helpUrl = 'transparent.html';

	constructor() {
		super("transparent");
	}

	isProperSubsetOf(otherType) {
		return false;
	}

	mayBeCompatibleWithValue(val) {
		return typeof val === 'string' && val.toLowerCase() === 'transparent';
	}

	mayBeCompatibleWith(token) {
		if (!DataType.mayBeData(token))
			return false;
		if ([
			ParseTreeTokenType.BOOLEAN_LITERAL,
			ParseTreeTokenType.LIST,
			ParseTreeTokenType.NUMBER_LITERAL
		].indexOf(token.type) !== -1)
			return false;
		if ([ParseTreeTokenType.STRING_LITERAL, ParseTreeTokenType.LONG_STRING_LITERAL].indexOf(token.type) !== -1)
			return token.val.toLowerCase() === this.name;

		return true;
	}

	getIntersectionWith(otherType) {
		if (otherType.name === this.name)
			return otherType;
		else
			return null;
	}
};