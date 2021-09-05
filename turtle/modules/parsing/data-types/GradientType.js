import { DataType } from './DataType.js';
import { Gradient } from '../../drawing/vector/shapes/gradients/Gradient.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
// not awaiting Gradient.asyncInit() because it is not necessary.
// GradientType doesn't use any of Gradient's methods let alone 
// one depending on it awaiting on Colour or AlphaColour.

export class GradientType extends DataType {
	static helpUrl = 'gradient.html';

	constructor() {
		super("gradient");
	}

	mayBeCompatibleWithValue(val) {
		return val instanceof Gradient;
	}

	mayBeCompatibleWith(token) {
		if (!DataType.mayBeData(token))
			return false;
		if ([ParseTreeTokenType.BOOLEAN_LITERAL, 
		ParseTreeTokenType.STRING_LITERAL, 
		ParseTreeTokenType.LONG_STRING_LITERAL,
		ParseTreeTokenType.LIST,
		ParseTreeTokenType.NUMBER_LITERAL].indexOf(token.type) !== -1)
			return false;

		return true;
	}

	getIntersectionWith(otherType) {
		if (otherType.name === 'gradient')
			return otherType;
		return null;
	}

	intersectsWith(otherType) {
		return 'gradient' === otherType.name;
	}
};