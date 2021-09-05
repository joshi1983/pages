import { DataType } from './DataType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export class BooleanType extends DataType {
	static helpUrl = 'boolean.html';

	constructor() {
		super("bool");
	}

	mayBeCompatibleWithValue(val) {
		return typeof val === 'boolean';
	}

	mayBeCompatibleWith(token) {
		if (!DataType.mayBeData(token))
			return false;
		if ([ParseTreeTokenType.NUMBER_LITERAL,
		ParseTreeTokenType.STRING_LITERAL,
		ParseTreeTokenType.LONG_STRING_LITERAL,
		ParseTreeTokenType.LIST].indexOf(token.type) !== -1)
			return false;

		return true;
	}

	getIntersectionWith(otherType) {
		if (otherType.name === 'bool')
			return this;
		else
			return null;
	}
}