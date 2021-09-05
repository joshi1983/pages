import { DataType } from './DataType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export class NumberType extends DataType {
	static helpUrl = 'number.html';

	static intType = new NumberType();

	constructor(isFiniteOnly, isUnfiniteOnly, min) {
		super("num");
		if (typeof isFiniteOnly !== 'boolean')
			isFiniteOnly = false;
		if (typeof isUnfiniteOnly !== 'boolean' || isFiniteOnly)
			isUnfiniteOnly = false;
		if (typeof min !== 'number')
			min = -Infinity;
		else if (isUnfiniteOnly && Number.isFinite(min))
			min = Infinity;
			// UnfiniteOnly is a set of -Infinity and Infinity.
		if (min === Infinity) {
			isUnfiniteOnly = true;
			isFiniteOnly = false; // It can't be finite only or it would be an empty set 
				// because of the contradiction(Infinity is not finite).
				// A NumberType shouldn't be used to represent an empty set.
		}

		this.min = min;
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
		if (val < this.min)
			return false;

		if (this.isFiniteOnly)
			return Number.isFinite(val);

		if (this.isUnfiniteOnly) {
			if (Number.isFinite(val))
				return false;
		}
		return typeof val === 'number' && !isNaN(val);
	}

	mayBeCompatibleWith(token) {
		if (token.type === ParseTreeTokenType.NUMBER_LITERAL &&
		token.val < this.min)
			return false;

		return !NumberType.isDefinitelyNotCompatibleWith(token);
	}

	intersectsWith(otherType) {
		return NumberType.isIntersectingNumberTypes(this, otherType);
	}

	getIntersectionWith(otherType, nameToTypeFactory) {
		let resultMin = this.min;
		if (otherType.name === 'num' && otherType.min > resultMin) {
			resultMin = otherType.min;
		}
		if ('int' === otherType.name) {
			if (this.isUnfiniteOnly)
				return null; // Infinity, -Infinity, and indeteterminate are not integers so no intersection.
			return otherType;
				// FIXME: if/when IntegerType supports a minimum value,
				// consider resultMin's value here.
				// For the time being, it seems better to return all integers instead of 
				// this.  Both lose some information but integers seems like a closer fit.
		}
		if ('num' === otherType.name) {
			if (this.isFiniteOnly) {
				if (!otherType.isUnfiniteOnly) {
					if (resultMin === this.min)
						return this;
					else
						return new NumberType(this.isFiniteOnly, this.isUnfiniteOnly, resultMin);
				}
				else
					return null; // indicate no intersection.
			}
			if (this.isUnfiniteOnly) {
				if (!otherType.isFiniteOnly) {
					if (resultMin === this.min)
						return this;
					else
						return new NumberType(this.isFiniteOnly, this.isUnfiniteOnly, resultMin);
				}
				else if (otherType.isFiniteOnly)
					return null; // indicate no intersection.
			}
			if (resultMin === otherType.min)
				return otherType;
			else
				return new NumberType(otherType.isFiniteOnly, otherType.isUnfiniteOnly,
					resultMin);
		}
		if (otherType.name === 'color')
			return nameToTypeFactory('int');

		return null; // indicate no intersection.
	}

	isSubsetOf(otherType) {
		if (otherType.name !== 'num')
			return false;
		if (otherType.min > this.min) {
			return false;
		}
		if (this.isFiniteOnly) {
			return !otherType.isUnfiniteOnly;
		}
		if (this.isUnfiniteOnly) {
			return !otherType.isFiniteOnly;
		}
		if (otherType.isFiniteOnly ||
		otherType.isUnfiniteOnly)
			return false;
		return true;
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
		if (n1.name === 'num' && n2.name === 'int') {
			return n1.isUnfiniteOnly === false;
		}
		return NumberType.isIntersectableWithNumericType(n1) &&
			NumberType.isIntersectableWithNumericType(n2);
	}

	tightenForValue(value) {
		if (Number.isFinite(value))
			return new NumberType(true, false, value);
		else if (value === Infinity || value === -Infinity)
			return new NumberType(false, true, value);
		else {
			// FIXME: can this happen?  
			// Is there a number for which !Number.isFinite(value) && value !== Infinity && value !== -Infinity?
			// Can value be NaN?
			// Maybe this else case can be removed as dead code.
			if (this.isFiniteOnly === false && this.isUnfiniteOnly === false &&
			this.min === value)
				return this;
			else
				return new NumberType(false, false, value);
		}
	}

	toString() {
		if (this.isFiniteOnly) {
			if (this.min > -Infinity)
				return `num(finite,min=${this.min})`.toLowerCase();
			return 'num(finite)';
		}
		if (this.isUnfiniteOnly) {
			if (this.min > -Infinity)
				return 'num(unfinite,min=infinity)';
			return 'num(unfinite)';
		}
		if (this.min > -Infinity)
			return `num(min=${this.min})`.toLowerCase();
		return 'num';
	}
};

NumberType.intType.name = 'int';
// I'd like to do this in a static block within the body of NumberType but that is not supported by 
// Mozilla Firefox version 91.0.2 and I want to keep the code somewhat broadly compatible.
