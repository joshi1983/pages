import { DataType } from './DataType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export class NumberType extends DataType {
	static helpUrl = 'number.html';

	static intType = new NumberType();

	constructor(isFiniteOnly) {
		super("num");
		if (typeof isFiniteOnly !== 'boolean')
			isFiniteOnly = false;
		this.isFiniteOnly = isFiniteOnly;
	}

	static isDefinitelyNotCompatibleWith(token) {
		if (!DataType.mayBeData(token))
			return true;
		if ([ParseTreeTokenType.LIST,
		ParseTreeTokenType.STRING_LITERAL,
		ParseTreeTokenType.LONG_STRING_LITERAL,
		ParseTreeTokenType.BOOLEAN_LITERAL].indexOf(token.type) !== -1)
			return true;
		return false;
	}

	mayBeCompatibleWithValue(val) {
		if (this.isFiniteOnly && (val === Infinity || val === -Infinity))
			return false;
		return typeof val === 'number' && !isNaN(val);
	}

	mayBeCompatibleWith(token) {
		return !NumberType.isDefinitelyNotCompatibleWith(token);
	}

	intersectsWith(otherType) {
		return NumberType.isIntersectingNumberTypes(this, otherType);
	}

	getIntersectionWith(otherType, nameToTypeFactory) {
		if ('int' === otherType.name)
			return otherType;
		if ('num' === otherType.name) {
			if (this.isFiniteOnly)
				return this;
			return otherType;
		}
		if (otherType.name === 'color')
			return nameToTypeFactory('int');

		return null;
	}

	isSubsetOf(otherType) {
		if (otherType.name !== 'num')
			return false;
		return this.isFiniteOnly;
	}

	static isIntersectableWithNumericType(type1) {
		return ['color', 'int', 'num'].indexOf(type1.name);
	}

	static isIntersectingNumberTypes(n1, n2) {
		return NumberType.isIntersectableWithNumericType(n1) &&
			NumberType.isIntersectableWithNumericType(n2);
	}

	toString() {
		if (this.isFiniteOnly)
			return 'num(finite)';

		return 'num';
	}
};

NumberType.intType.name = 'int';
// I'd like to do this in a static block within the body of NumberType but that is not supported by 
// Mozilla Firefox version 91.0.2 and I want to keep the code somewhat broadly compatible.
