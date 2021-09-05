import { DataType } from './DataType.js';
import { ColorStringType } from './ColorStringType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export class StringType extends DataType {
	static helpUrl = 'string.html';

	constructor() {
		super("string");
	}

	mayBeCompatibleWithValue(val) {
		return typeof val === 'string';
	}

	mayBeCompatibleWith(token) {
		if (!DataType.mayBeData(token))
			return false;
		if ([ParseTreeTokenType.LIST,
		ParseTreeTokenType.NUMBER_LITERAL,
		ParseTreeTokenType.BOOLEAN_LITERAL].indexOf(token.type) !== -1)
			return false;

		return true;
	}

	getIntersectionWith(otherType) {
		if (otherType.name.startsWith('cproc'))
			return otherType;
		if (['string', 'colorstring'].indexOf(otherType.name) !== -1)
			return otherType;
		else
			return null;
	}

	intersectsWith(otherType) {
		if (otherType.name.startsWith('cproc'))
			return true;
		return ['color', 'colorstring', 'string'].indexOf(otherType.name) !== -1;
	}
}