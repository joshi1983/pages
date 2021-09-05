import { DataType } from './DataType.js';
import { IntegerType } from './IntegerType.js';
import { isNumber } from '../../isNumber.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const intType = new IntegerType();
let intDataTypes;

async function asyncInit() {
	const DataTypes = (await import('./DataTypes.js')).DataTypes;
	intDataTypes = new DataTypes('int');
}

/*
Represents the intersection of ColorType with DataListType.
*/
export class ColorListType extends DataType {
	constructor() {
		super('colorlist');
		this.mayBeCompatibleWithValue = ColorListType.mayBeCompatibleWithValue;
	}

	static async asyncInit() {
		await asyncInit();
	}

	getIntersectionWith(otherType) {
		if (otherType.name === 'list' && otherType.subtypes !== undefined && intDataTypes !== undefined) {
			if (!otherType.subtypes.hasIntersectionWith(intDataTypes))
				return null;
		}
		if (otherType.name === 'list' && otherType.minLen > 3)
			return null; // no intersection.
		if (['alphacolor', 'color', 'list', 'colorlist'].indexOf(otherType.name) !== -1)
			return this;
		return null;
	}

	static isDefinitelyCompatibleWith(token) {
		if (token.type !== ParseTreeTokenType.LIST)
			return false;
		const vals = token.children.filter(child => !child.isBracket());
		if (vals.length === 3) {
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

	isProperSubsetOf(otherType, DataTypes) {
		if (otherType.name === 'list') {
			if (otherType.minLen > 3)
				return false;
			if (otherType.subtypes === undefined)
				return true;
			return DataTypes.contains(otherType.subtypes, intType);
		}
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
			if (token.children.length !== 5)// 2 brackets + 3 rgb components
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
		if (otherType.name === 'list') {
			if (otherType.minLen > 3)
				return false;
			if (otherType.subtypes !== undefined && intDataTypes !== undefined) {
				return otherType.subtypes.hasIntersectionWith(intDataTypes);
			}
		}
		return ['alphacolor', 'color', 'list', 'colorlist'].indexOf(otherType.name) !== -1;
	}
};