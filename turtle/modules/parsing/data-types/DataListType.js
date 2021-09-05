import { DataType } from './DataType.js';
import { ColorListType } from './ColorListType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export class DataListType extends DataType {
	static helpUrl = 'list.html';

	constructor() {
		super("list");
	}

	mayBeCompatibleWithValue(val) {
		return val instanceof Array;
	}

	mayBeCompatibleWith(token) {
		if (!DataType.mayBeData(token))
			return false;
		if ([ParseTreeTokenType.NUMBER_LITERAL,
		ParseTreeTokenType.STRING_LITERAL,
		ParseTreeTokenType.LONG_STRING_LITERAL,
		ParseTreeTokenType.BOOLEAN_LITERAL].indexOf(token.type) !== -1)
			return false;

		return true;
	}

	getIntersectionWith(otherType) {
		if (otherType.name === 'list' || otherType.name === 'colorlist')
			return otherType;
		if (otherType.name === 'color')
			return new ColorListType();

		return null;
	}

	intersectsWith(otherType) {
		return ['color', 'colorlist', 'list'].indexOf(otherType.name) !== -1;
	}
}