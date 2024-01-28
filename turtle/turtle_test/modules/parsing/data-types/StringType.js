import { AlphaColorStringType } from './AlphaColorStringType.js';
import { ColorStringType } from './ColorStringType.js';
import { DataType } from './DataType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const nonStringTypes = new Set([
ParseTreeTokenType.BOOLEAN_LITERAL,
ParseTreeTokenType.LIST,
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.UNARY_OPERATOR
]);

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
		if (nonStringTypes.has(token.type))
			return false;

		return true;
	}

	getIntersectionWith(otherType) {
		if (otherType.name.startsWith('cproc'))
			return otherType;
		if (['alphacolorstring', 'string', 'colorstring'].indexOf(otherType.name) !== -1)
			return otherType;
		else if (otherType.name === 'color')
			return new ColorStringType();
		else if (otherType.name === 'alphacolor')
			return new AlphaColorStringType();
		else
			return null;
	}

	intersectsWith(otherType) {
		if (otherType.name.startsWith('cproc'))
			return true;
		return ['alphacolor', 'alphacolorstring', 'color', 'colorstring', 'string'].indexOf(otherType.name) !== -1;
	}
}