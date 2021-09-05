import { DataType } from './DataType.js';
import { Gradient } from '../../drawing/vector/shapes/gradients/Gradient.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

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