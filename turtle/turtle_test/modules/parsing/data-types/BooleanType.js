import { DataType } from './DataType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const nonBooleanTypes = new Set([
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.LIST,
ParseTreeTokenType.LONG_STRING_LITERAL,
ParseTreeTokenType.STRING_LITERAL
]);

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
		if (nonBooleanTypes.has(token.type))
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