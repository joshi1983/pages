import { DataType } from './DataType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const nonTupleTypes = new Set([
ParseTreeTokenType.LIST_LITERAL,
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.STRING_LITERAL,
ParseTreeTokenType.TUPLE_LITERAL
]);

export class BooleanType extends DataType {
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
}