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

	constructor(minLen) {
		super("string");
		if (minLen === undefined || minLen < 0)
			minLen = 0;
		this.minLen = minLen;
	}

	mayBeCompatibleWithValue(val) {
		if (typeof val !== 'string')
			return false;
		if (this.minLen > val.length)
			return false;
		return true;
	}

	mayBeCompatibleWith(token) {
		if (!DataType.mayBeData(token))
			return false;
		if (nonStringTypes.has(token.type))
			return false;
		if (token.isStringLiteral()) {
			return token.val.length >= this.minLen;
		}
		return true;
	}

	getIntersectionWith(otherType) {
		if (otherType.name === 'string') {
			if (this.minLen > otherType.minLen)
				return this;
			else
				return otherType;
		}
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

	isSubsetOf(otherType) {
		if (otherType.name !== 'string')
			return false;
		if (otherType.minLen === this.minLen)
			return true; // equal.  Not a proper subset but a subset nevertheless.
		if (this.minLen !== undefined) {
			if (otherType.minLen === undefined)
				return true;
			if (otherType.minLen < this.minLen)
				return true;
		}
		return false;
	}

	toString() {
		let attrsExpression = '';
		if (this.minLen !== undefined && this.minLen > 0)
			attrsExpression = `(minlen=${this.minLen})`;
		return super.toString() + attrsExpression;
	}
}