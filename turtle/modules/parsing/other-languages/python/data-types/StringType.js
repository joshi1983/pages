import { DataType } from './DataType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const nonStringTypes = new Set([
ParseTreeTokenType.BOOLEAN_LITERAL,
ParseTreeTokenType.LIST_LITERAL,
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.TUPLE_LITERAL,
]);

export class StringType extends DataType {
	constructor() {
		super("string");
	}

	mayBeCompatibleWithValue(val) {
		return typeof val === 'string';
	}

	mayBeCompatibleWith(token) {
		if (!DataType.mayBeData(token))
			return false;
		if (nonStringTypes.has(token.type))
			return false;

		return true;
	}
}