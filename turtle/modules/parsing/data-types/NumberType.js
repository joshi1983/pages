import { DataType } from './DataType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export class NumberType extends DataType {
	static helpUrl = 'number.html';

	static intType = new NumberType();

	constructor(isFiniteOnly, isUnfiniteOnly) {
		super("num");
		if (typeof isFiniteOnly !== 'boolean')
			isFiniteOnly = false;
		if (typeof isUnfiniteOnly !== 'boolean' || isFiniteOnly)
			isUnfiniteOnly = false;
			
		this.isFiniteOnly = isFiniteOnly;
		this.isUnfiniteOnly = isUnfiniteOnly;
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
		if (this.isFiniteOnly)
			return Number.isFinite(val);

		if (this.isUnfiniteOnly) {
			if (Number.isFinite(val))
				return false;
		}
		return typeof val === 'number' && !isNaN(val);
	}

	mayBeCompatibleWith(token) {
		return !NumberType.isDefinitelyNotCompatibleWith(token);
	}

	intersectsWith(otherType) {
		return NumberType.isIntersectingNumberTypes(this, otherType);
	}

	getIntersectionWith(otherType, nameToTypeFactory) {
		if ('int' === otherType.name) {
			if (this.isUnfiniteOnly)
				return null; // Infinity, -Infinity, and indeteterminate are not integers so no intersection.
			return otherType;
		}
		if ('num' === otherType.name) {
			if (this.isFiniteOnly) {
				if (!otherType.isUnfiniteOnly)
					return this;
				else
					return null; // indicate no intersection.
			}
			if (this.isUnfiniteOnly) {
				if (!otherType.isFiniteOnly)
					return this;
				else if (otherType.isFiniteOnly)
					return null; // indicate no intersection.
			}
			return otherType;
		}
		if (otherType.name === 'color')
			return nameToTypeFactory('int');

		return null; // indicate no intersection.
	}

	isSubsetOf(otherType) {
		if (otherType.name !== 'num')
			return false;
		if (this.isFiniteOnly) {
			return !otherType.isUnfiniteOnly;
		}
		if (this.isUnfiniteOnly) {
			return !otherType.isFiniteOnly;
		}
		return this.isFiniteOnly;
	}

	static isIntersectableWithNumericType(type1) {
		return ['color', 'int', 'num'].indexOf(type1.name) !== -1;
	}

	static isIntersectingNumberTypes(n1, n2) {
		if (n1.name === 'num' && n2.name === 'num') {
			if (n1.isFiniteOnly)
				return !n2.isUnfiniteOnly;
			if (n1.isUnfiniteOnly)
				return !n2.isFiniteOnly;
			return true;
		}
		if (n1.name === 'int' && n2.name === 'num')
			[n1, n2] = [n2, n1]; // swap.
		if (n1.name === 'num' && n2.name === 'int')
			return n1.isUnfiniteOnly === false;
		return NumberType.isIntersectableWithNumericType(n1) &&
			NumberType.isIntersectableWithNumericType(n2);
	}

	tightenForValue(value) {
		if (Number.isFinite(value))
			return new NumberType(true, false);
		else if (value === Infinity || value === -Infinity)
			return new NumberType(false, true);
		else {
			if (this.isFiniteOnly === false && this.isUnfiniteOnly === false)
				return this;
			else
				return new NumberType();
		}
	}

	toString() {
		if (this.isFiniteOnly)
			return 'num(finite)';
		if (this.isUnfiniteOnly)
			return 'num(unfinite)';

		return 'num';
	}
};

NumberType.intType.name = 'int';
// I'd like to do this in a static block within the body of NumberType but that is not supported by 
// Mozilla Firefox version 91.0.2 and I want to keep the code somewhat broadly compatible.
