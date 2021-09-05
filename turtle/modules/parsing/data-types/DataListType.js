import { AlphaColorListType } from './AlphaColorListType.js';
import { areDataTypesContaining } from './areDataTypesContaining.js';
import { ColorListType } from './ColorListType.js';
import { DataType } from './DataType.js';
import { DataTypes } from './DataTypes.js';
import { IntegerType } from './IntegerType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const notListTypes = new Set([
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.LONG_STRING_LITERAL,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.UNARY_OPERATOR
]);

const intTypes = new Set([new IntegerType()]);

export class DataListType extends DataType {
	static helpUrl = 'list.html';

	/*
	subtypes should either be undefined, a Set, or a DataTypes instance.
	*/
	constructor(subtypes, minLen) {
		super("list");
		if (subtypes instanceof Set)
			subtypes = new DataTypes(subtypes);
		if (minLen === undefined || minLen < 0)
			minLen = 0;
		this.subtypes = subtypes;
		this.minLen = minLen;
	}

	getIntersectionWith(otherType) {
		if (otherType.name === 'list') {
			const intersectingMinLen = Math.max(this.minLen, otherType.minLen);
			if (otherType.subtypes === undefined) {
				if (this.minLen !== intersectingMinLen) {
					if (this.subtypes === undefined)
						return otherType;
					else
						return new DataListType(this.subtypes, intersectingMinLen);
				}
				return this;
			}
			if (this.subtypes === undefined) {
				if (otherType.minLen === intersectingMinLen)
					return otherType;
				else
					return new DataListType(otherType.subtypes, intersectingMinLen);
			}
			const intersectedSubtypes = DataTypes.intersect(this.subtypes.types,
				otherType.subtypes.types);
			if (intersectedSubtypes.size === 0)
				return null;
			return new DataListType(intersectedSubtypes, intersectingMinLen);
		}
		if ((otherType.name === 'colorlist' ||
		otherType.name === 'color') && this.minLen > 3)
			return null;
		if (otherType.name === 'alphacolorlist' && this.minLen > 4)
			return null;

		if (otherType.name === 'colorlist' || otherType.name === 'alphacolorlist' ||
		otherType.name === 'color' || otherType.name === 'alphacolor') {
			if (this.subtypes === undefined)
				return otherType;
			if (DataTypes.contains(this.subtypes.types, intTypes))
				return otherType;
			return null; // indicate no intersection found
		}
		if (otherType.name === 'color')
			return new ColorListType();
		if (otherType.name === 'alphacolor')
			return new AlphaColorListType();
		return null;
	}

	intersectsWith(otherType) {
		if ((otherType.name === 'color' ||
		otherType.name === 'colorlist') && this.minLen > 3) {
			return false;
		}
		if ((otherType.name === 'alphacolorlist' ||
		otherType.name === 'alphacolor') && this.minLen > 4) {
			return false;
		}
		if (this.subtypes === undefined)
			return ['alphacolor', 'alphacolorlist', 'color', 'colorlist', 'list'].
				indexOf(otherType.name) !== -1;
		else
			return this.getIntersectionWith(otherType) !== null;
	}

	isSubsetOf(otherType) {
		if (otherType.name !== 'list')
			return false;
		if (this.minLen < otherType.minLen)
			return false;
		if (otherType.subtypes === undefined)
			return true;
		if (this.subtypes === undefined)
			return false;
		return areDataTypesContaining(otherType.subtypes.types, this.subtypes.types);
	}

	mayBeCompatibleWithValue(val) {
		if (!(val instanceof Array))
			return false;
		if (this.minLen > val.length)
			return false;
		if (val.length === 0 || this.subtypes === undefined)
			return true;
		for (let i = 0; i < val.length; i++) {
			const elementVal = val[i];
			let found = false;
			for (const subtype of this.subtypes.types) {
				if (subtype.mayBeCompatibleWithValue(elementVal)) {
					found = true;
					break;
				}
			}
			if (!found)
				return false;
		}
		return true;
	}

	mayBeCompatibleWith(token) {
		if (!DataType.mayBeData(token))
			return false;
		if (notListTypes.has(token.type))
			return false;

		return true;
	}

	tightenForValue(value, extraInfo) {
		const subtypes = DataTypes.getTypesCompatibleWithValue(value[0], extraInfo);
		for (let i = 1; i < value.length; i++) {
			subtypes.addTypes(DataTypes.getTypesCompatibleWithValue(value[i], extraInfo));
		}
		if (subtypes.isEmpty())
			return new DataListType(undefined, value.length);
		else
			return new DataListType(subtypes, value.length);
	}

	toString() {
		let attributesExpression = '';
		if (this.minLen > 0)
			attributesExpression = `(minlen=${this.minLen})`;
		let subtypesTemplate = '';
		if (this.subtypes !== undefined) {
			if (typeof this.subtypes.isEmpty !== 'function')
				throw new Error(`isEmpty is ${this.subtypes.isEmpty} instead of a function`);
			if (!this.subtypes.isEmpty())
				subtypesTemplate = `<${DataTypes.stringify(this.subtypes)}>`;
		}
		return super.toString() + subtypesTemplate + attributesExpression;
	}
}