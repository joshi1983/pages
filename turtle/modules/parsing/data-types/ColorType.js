import { ColorStringType } from './ColorStringType.js';
import { ColorListType } from './ColorListType.js';
import { Colour } from '../../Colour.js';
import { DataType } from './DataType.js';
import { IntegerType } from './IntegerType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export class ColorType extends DataType {
	constructor() {
		super("color");
	}

	isUnionOfSubtypes() {
		return true;
	}

	static getDisconnectedSubtypeSet() {
		return ColorType.getSubtypeSet();
	}

	static getSubtypeSet() {
		return new Set([
			new IntegerType(),
			new ColorStringType(),
			new ColorListType()
		]);
	}

	getIntersectionWith(otherType) {
		if (['color', 'colorlist', 'colorstring', 'int'].indexOf(otherType.name) !== -1)
			return otherType;
		if (otherType.name === 'string')
			return new ColorStringType();
		if (otherType.name === 'alphacolorlist' || otherType.name === 'list')
			return new ColorListType();
		if (otherType.name === 'num')
			return new IntegerType();
		return null;
	}

	intersectsWith(otherType) {
		return ['alphacolorlist', 'color', 'colorlist', 'colorstring', 
		'int', 'num', 'string', 'list'].indexOf(otherType.name) !== -1;
	}

	mayBeCompatibleWithValue(val) {
		return ColorStringType.mayBeCompatibleWithValue(val) ||
			ColorListType.mayBeCompatibleWithValue(val) ||
			IntegerType.mayBeCompatibleWithValue(val);
	}

	mayBeCompatibleWith(token) {
		if (!DataType.mayBeData(token))
			return false;
		if (token.type === ParseTreeTokenType.BOOLEAN_LITERAL)
			return false;
		if (token.isStringLiteral())
			return Colour.isValidColourString(token.val);
		if (token.type === ParseTreeTokenType.LIST)
			return ColorListType.mayBeColorList(token);
		if (token.type === ParseTreeTokenType.NUMBER_LITERAL && !Number.isInteger(token.val))
			return false;

		return true;
	}
};