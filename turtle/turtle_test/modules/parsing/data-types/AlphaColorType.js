import { AlphaColorListType } from './AlphaColorListType.js';
import { AlphaColorStringType } from './AlphaColorStringType.js';
import { AlphaColour } from '../../AlphaColour.js';
import { ColorListType } from './ColorListType.js';
import { ColorStringType } from './ColorStringType.js';
import { ColorType } from './ColorType.js';
import { DataType } from './DataType.js';
import { IntegerType } from './IntegerType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const disconnectedSubtypes = new Set([
	new IntegerType(),
	new AlphaColorStringType(),
	new ColorStringType(),
	new AlphaColorListType(),
	new ColorListType()
]);
const subtypes = new Set([
	new IntegerType(),
	new AlphaColorStringType(),
	new ColorType(),
	new ColorStringType(),
	new AlphaColorListType(),
	new ColorListType()
]);

export class AlphaColorType extends DataType {
	static helpUrl = 'alphacolor.html';

	constructor() {
		super("alphacolor");
		this.mayBeCompatibleWithValue = AlphaColorType.mayBeCompatibleWithValue;
	}

	static getDisconnectedSubtypeSet() {
		return disconnectedSubtypes;
	}

	static getSubtypeSet() {
		return subtypes;
	}

	getIntersectionWith(otherType) {
		if (['alphacolorlist', 'alphacolorstring', 'color', 'colorlist', 
		'colorstring', 'int'].indexOf(otherType.name) !== -1)
			return otherType;
		if (otherType.name === 'string')
			return new AlphaColorStringType();
		if (otherType.name === 'list')
			return new AlphaColorListType();
		if (otherType.name === 'num')
			return new IntegerType();
		return null;
	}

	static isDefinitelyCompatibleWith(token) {
		return AlphaColorListType.isDefinitelyCompatibleWith(token) ||
			ColorListType.isDefinitelyCompatibleWith(token) ||
			AlphaColorStringType.isDefinitelyCompatibleWith(token) ||
			ColorStringType.isDefinitelyCompatibleWith(token) ||
			IntegerType.isDefinitelyCompatibleWith(token);
	}

	isUnionOfSubtypes() {
		return true;
	}

	mayBeCompatibleWith(token) {
		if (!DataType.mayBeData(token))
			return false;
		if (token.type === ParseTreeTokenType.BOOLEAN_LITERAL)
			return false;
		if (token.isStringLiteral())
			return AlphaColour.isValidColourString(token.val);
		if (token.type === ParseTreeTokenType.LIST)
			return AlphaColorListType.mayBeAlphaColorList(token) ||
				ColorListType.mayBeColorList(token);
		if (token.type === ParseTreeTokenType.NUMBER_LITERAL && !Number.isInteger(token.val))
			return false;

		return true;
	}

	static mayBeCompatibleWithValue(val) {
		return AlphaColorListType.mayBeCompatibleWithValue(val) ||
			ColorListType.mayBeCompatibleWithValue(val) ||
			AlphaColorStringType.mayBeCompatibleWithValue(val) ||
			ColorStringType.mayBeCompatibleWithValue(val) ||
			IntegerType.mayBeCompatibleWithValue(val);
	}
}