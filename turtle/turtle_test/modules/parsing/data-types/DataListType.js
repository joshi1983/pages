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

	constructor(subtypes) {
		super("list");
		if (subtypes instanceof Set)
			subtypes = new DataTypes(subtypes);
		this.subtypes = subtypes;
	}

	mayBeCompatibleWithValue(val) {
		if (!(val instanceof Array))
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

	getIntersectionWith(otherType) {
		if (otherType.name === 'list') {
			if (otherType.subtypes === undefined)
				return this;
			if (this.subtypes === undefined)
				return otherType;
			const intersectedSubtypes = DataTypes.intersect(this.subtypes.types, otherType.subtypes.types);
			if (intersectedSubtypes.size === 0)
				return null;
			return new DataListType(intersectedSubtypes);
		}
		if (otherType.name === 'colorlist' || otherType.name === 'alphacolorlist' || otherType.name === 'color' || otherType.name === 'alphacolor') {
			if (this.subtypes === undefined)
				return otherType;
			if (DataTypes.contains(this.subtypes.types, intTypes))
				return otherType;
			return null; // indicate no intersection found
		}
		if ('list' === otherType.name)
			return otherType;
		if (otherType.name === 'color')
			return new ColorListType();
		if (otherType.name === 'alphacolor')
			return new AlphaColorListType();
		return null;
	}

	intersectsWith(otherType) {
		if (this.subtypes === undefined)
			return ['alphacolor', 'alphacolorlist', 'color', 'colorlist', 'list'].indexOf(otherType.name) !== -1;
		else
			return this.getIntersectionWith(otherType) !== null;
	}

	isSubsetOf(otherType) {
		if (otherType.name !== 'list')
			return false;
		if (otherType.subtypes === undefined)
			return true;
		if (this.subtypes === undefined)
			return false;
		return areDataTypesContaining(otherType.subtypes.types, this.subtypes.types);
	}

	tightenForValue(value, extraInfo) {
		const subtypes = DataTypes.getTypesCompatibleWithValue(value[0], extraInfo);
		for (let i = 1; i < value.length; i++) {
			subtypes.addTypes(DataTypes.getTypesCompatibleWithValue(value[i], extraInfo));
		}
		if (subtypes.isEmpty())
			return new DataListType();
		else
			return new DataListType(subtypes);
	}

	toString() {
		if (this.subtypes === undefined)
			return super.toString();
		else {
			return `${super.toString()}<${DataTypes.stringify(this.subtypes)}>`;
		}
	}
}