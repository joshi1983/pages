import { DataType } from './DataType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const nonListTypes = new Set([
ParseTreeTokenType.BOOLEAN_LITERAL,
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.STRING_LITERAL,
ParseTreeTokenType.TUPLE_LITERAL,
]);

export class DataListType extends DataType {
	constructor() {
		super("list");
	}

	mayBeCompatibleWithValue(val) {
		return val instanceof Array;
	}

	mayBeCompatibleWith(token) {
		if (!DataType.mayBeData(token))
			return false;
		if (nonListTypes.has(token.type))
			return false;

		return true;
	}
}