import { AlphaColour } from '../../AlphaColour.js';
import { ColorListType } from './ColorListType.js';
import { DataType } from './DataType.js';
import { IntegerType } from './IntegerType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

/*
Represents the intersection of AlphaColorType with DataListType.
*/
export class AlphaColorListType extends DataType {
	constructor() {
		super('alphacolorlist');
		this.mayBeCompatibleWithValue = AlphaColorListType.mayBeCompatibleWithValue;
		this.mayBeCompatibleWith = AlphaColorListType.mayBeAlphaColorList;
	}

	getIntersectionWith(otherType) {
		if (['alphacolor', 'alphacolorlist', 'list'].indexOf(otherType.name) !== -1)
			return this;
		return null;
	}

	static getSubtypeSet() {
		return new Set([]);
	}

	static isDefinitelyCompatibleWith(token) {
		if (token.type !== ParseTreeTokenType.LIST)
			return false;
		const vals = token.children.filter(child => !child.isBracket());
		if (vals.length === 4) {
			const children = token.children;
			for (let i = 0; i < children.length; i++) {
				const child = children[i];
				if (!child.isBracket() &&
				!IntegerType.isDefinitelyCompatibleWith(child))
					return false;
			}
			return true;
		}
		return false;
	}

	isProperSubsetOf(otherType) {
		return ['alphacolor', 'list'].indexOf(otherType.name) !== -1;
	}

	static mayBeAlphaColorList(token) {
		if (!DataType.mayBeData(token))
			return false;
		if ([ParseTreeTokenType.STRING_LITERAL,
		ParseTreeTokenType.LONG_STRING_LITERAL,
		ParseTreeTokenType.NUMBER_LITERAL,
		ParseTreeTokenType.BOOLEAN_LITERAL].indexOf(token.type) !== -1)
			return false;
		if (token.type === ParseTreeTokenType.LIST) {
			if (token.children.length !== 6)
				return false;
			else {
				for (let i = 1; i <= 4; i++) {
					const rgbToken = token.children[i];
					if (!IntegerType.mayBeInt(rgbToken))
						return false;
				}
			}
		}
		return true;
	}

	static mayBeCompatibleWithValue(val) {
		if (!(val instanceof Array))
			return false;
		if (val.length !== 4)
			return false;
		return AlphaColour.isValidRGBArray(val);
	}
}