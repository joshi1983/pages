import { AlphaColour } from '../../AlphaColour.js';
import { ColorStringType } from './ColorStringType.js';
import { DataType } from './DataType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

async function asyncInit() {
	await AlphaColour.asyncInit();
	await ColorStringType.asyncInit();
}
const initPromise = asyncInit();
const colorString = new ColorStringType();

/*
Represents the intersection of alphacolor and string but excludes every value from colorstring.
The set of all valid HTML colour hex codes that are 4 or 8 digits long.
*/
export class AlphaColorStringType extends DataType {
	static asyncInit() {
		return initPromise;
	}

	constructor() {
		super('alphacolorstring');
		this.mayBeCompatibleWithValue = AlphaColorStringType.mayBeCompatibleWithValue;
	}

	isProperSubsetOf(otherType) {
		return ['alphacolor', 'string'].indexOf(otherType.name) !== -1;
	}

	mayBeCompatibleWith(token) {
		if (token.isStringLiteral())
			return AlphaColour.isValidAlphaColourString(token.val);
		return colorString.mayBeCompatibleWith(token);
	}

	static mayBeCompatibleWithValue(val) {
		return typeof val === 'string' && AlphaColour.isValidAlphaColourString(val);
	}

	getIntersectionWith(otherType) {
		if (['alphacolor', 'alphacolorstring', 'string'].indexOf(otherType.name) !== -1)
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
		return ['alphacolor', 'alphacolorstring', 'string'].indexOf(otherType.name) !== -1;
	}
}