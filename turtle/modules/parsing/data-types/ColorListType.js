import { DataType } from './DataType.js';
import { IntegerType } from './IntegerType.js';
import { isNumber } from '../../isNumber.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

/*
Represents the intersection of ColorType with DataListType.
*/
export class ColorListType extends DataType {
	constructor() {
		super('colorlist');
		this.mayBeCompatibleWithValue = ColorListType.mayBeCompatibleWithValue;
	}

	getIntersectionWith(otherType) {
		if (['alphacolor', 'color', 'list', 'colorlist'].indexOf(otherType.name) !== -1)
			return this;
		return null;
	}

	isProperSubsetOf(otherType) {
		return ['alphacolor', 'color', 'list'].indexOf(otherType.name) !== -1;
	}

	static mayBeColorList(token) {
		if (!DataType.mayBeData(token))
			return false;
		if ([ParseTreeTokenType.STRING_LITERAL,
		ParseTreeTokenType.LONG_STRING_LITERAL,
		ParseTreeTokenType.NUMBER_LITERAL,
		ParseTreeTokenType.BOOLEAN_LITERAL].indexOf(token.type) !== -1)
			return false;
		if (token.type === ParseTreeTokenType.LIST) {
			if (token.children.length !== 5)
				return false;
			else {
				// all 3 elements must have the possibility of being integers from 0 to 255.
				for (let i = 1; i <= 3; i++) {
					const rgbToken = token.children[i];
					if (!IntegerType.mayBeInt(rgbToken))
						return false;
				}
			}
		}
		return true;
	}

	static mayBeCompatibleWithValue(val) {
		if (val instanceof Array && val.length === 3) {
			for (let i = 0; i < 3; i++) {
				if (!isNumber(val[i]))
					return false;
			}
			return true;
		}
		return false;
	}

	mayBeCompatibleWith(token) {
		return ColorListType.mayBeColorList(token);
	}

	intersectsWith(otherType) {
		return ['alphacolor', 'color', 'list', 'colorlist'].indexOf(otherType.name) !== -1;
	}
};