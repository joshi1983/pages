import { DataType } from './DataType.js';
import { isNumber } from '../../../isNumber.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export class NumberType extends DataType {
	constructor() {
		super("num");
	}

	mayBeCompatibleWithValue(val) {
		return isNumber(val);
	}

	mayBeCompatibleWith(token) {
		if (!DataType.mayBeData(token))
			return false;
		if ([ParseTreeTokenType.BOOLEAN_LITERAL,
		ParseTreeTokenType.LIST_LITERAL,
		ParseTreeTokenType.STRING_LITERAL,
		ParseTreeTokenType.TUPLE_LITERAL].indexOf(token.type) !== -1)
			return false;

		return true;
	}
}