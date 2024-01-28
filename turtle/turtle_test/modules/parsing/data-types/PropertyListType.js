import { DataType } from './DataType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export class PropertyListType extends DataType {
	static helpUrl = 'property-list.html';

	constructor() {
		super("plist");
	}

	mayBeCompatibleWithValue(val) {
		return val instanceof Map;
	}

	mayBeCompatibleWith(token) {
		if (!DataType.mayBeData(token))
			return false;
		if ([ParseTreeTokenType.NUMBER_LITERAL,
		ParseTreeTokenType.STRING_LITERAL,
		ParseTreeTokenType.LONG_STRING_LITERAL,
		ParseTreeTokenType.BOOLEAN_LITERAL,
		ParseTreeTokenType.LIST].indexOf(token.type) !== -1)
			return false;

		return true;
	}

	getIntersectionWith(otherType) {
		if ('plist' === otherType.name)
			return otherType;
		else
			return null;
	}

	intersectsWith(otherType) {
		return 'plist' === otherType.name;
	}
}