import { DataType } from './DataType.js';
import { Colour } from '../../Colour.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

/*
Represents the intersection of color and string.
The set of all valid colour names and HTML colour hex codes.
*/
export class ColorStringType extends DataType {
	static asyncInit() {
		return Colour.asyncInit();
	}

	constructor() {
		super('colorstring');
		this.mayBeCompatibleWithValue = ColorStringType.mayBeCompatibleWithValue;
	}

	isProperSubsetOf(otherType) {
		return ['alphacolor', 'color', 'string'].indexOf(otherType.name) !== -1;
	}

	static mayBeCompatibleWithValue(val) {
		return typeof val === 'string' && Colour.isValidColourString(val);
	}

	mayBeCompatibleWith(token) {
		if (!DataType.mayBeData(token))
			return false;
		if (token.isStringLiteral())
			return Colour.isValidColourString(token.val);

		if ([ParseTreeTokenType.NUMBER_LITERAL,
		ParseTreeTokenType.BOOLEAN_LITERAL,
		ParseTreeTokenType.LIST].indexOf(token.type) !== -1)
			return false;

		return true;
	}

	getIntersectionWith(otherType) {
		if (['alphacolor', 'color', 'colorstring', 'string'].indexOf(otherType.name) !== -1)
			return this;
		if (otherType.name.startsWith('cproc')) {
			// not exactly right.  
			// The result should be a type representing only procedure names that are also color names.
			// This is good enough for now until we find this causes a problem.
			return this;
		}
		return null;
	}

	intersectsWith(otherType) {
		if (otherType.name.startsWith('cproc')) {
			// cproc can intersect color string when a procedure's name matches a color's name.
			return true;
		}
		return ['alphacolor', 'color', 'colorstring', 'string'].indexOf(otherType.name) !== -1;
	}
}