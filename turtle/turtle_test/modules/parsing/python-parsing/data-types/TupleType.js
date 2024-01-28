import { DataType } from './DataType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const nonTupleTypes = new Set([
ParseTreeTokenType.BOOLEAN_LITERAL,
ParseTreeTokenType.LIST_LITERAL,
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.STRING_LITERAL,
]);

export class TupleType extends DataType {
	constructor() {
		super("tuple");
	}

	mayBeCompatibleWithValue(val) {
		return val instanceof Array;
	}

	mayBeCompatibleWith(token) {
		if (!DataType.mayBeData(token))
			return false;
		if (nonTupleTypes.has(token.type))
			return false;

		return true;
	}
}