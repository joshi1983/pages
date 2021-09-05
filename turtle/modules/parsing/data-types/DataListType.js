import { AlphaColorListType } from './AlphaColorListType.js';
import { ColorListType } from './ColorListType.js';
import { DataType } from './DataType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const notListTypes = new Set([
ParseTreeTokenType.BOOLEAN_LITERAL,
ParseTreeTokenType.BINARY_OPERATOR,
ParseTreeTokenType.LONG_STRING_LITERAL,
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.STRING_LITERAL,
ParseTreeTokenType.UNARY_OPERATOR
]);

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
		if (notListTypes.has(token.type))
			return false;

		return true;
	}

	getIntersectionWith(otherType) {
		if (['alphacolorlist', 'colorlist', 'list'].indexOf(otherType.name) !== -1)
			return otherType;
		if (otherType.name === 'color')
			return new ColorListType();
		if (otherType.name === 'alphacolor')
			return new AlphaColorListType();
		return null;
	}

	intersectsWith(otherType) {
		return ['alphacolor', 'alphacolorlist', 'color', 'colorlist', 'list'].indexOf(otherType.name) !== -1;
	}
}