import { DataType } from './DataType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export class NumberType extends DataType {
	static helpUrl = 'number.html';

	constructor(isFiniteOnly, isUnfiniteOnly, min, max) {
		super("num");
		if (typeof isFiniteOnly !== 'boolean')
			isFiniteOnly = false;
		if (typeof isUnfiniteOnly !== 'boolean' || isFiniteOnly)
			isUnfiniteOnly = false;
		if (typeof min !== 'number')
			min = -Infinity;
		else if (isUnfiniteOnly) {
			// Let's make the other parameters consistent with isUnfiniteOnly.

			isFiniteOnly = false;
			if (Number.isFinite(min))
				min = Infinity;
				// num(unfinite) is a set of just -Infinity and Infinity.
			if (Number.isFinite(max))
				max = Infinity;
		}
		if (typeof max !== 'number')
			max = Infinity;
		if (min === Infinity) {
			isUnfiniteOnly = true;
			isFiniteOnly = false; // It can't be finite only or it would be an empty set 
				// because of the contradiction(Infinity is not finite).
				// A NumberType shouldn't be used to represent an empty set.
		}
		else if (Number.isFinite(min) && Number.isFinite(max)) {
			isFiniteOnly = true;
			isUnfiniteOnly = false;
		}
		if (min > max)
			throw new Error(`min should never be greater than max. min=${min}, max=${max}.  If you want to represent an empty value set, use null instead of a NumberType.`);

		this.max = max;
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
		if (val < this.min || val > this.max)
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
		(token.val < this.min || token.val > this.max))
			return false;

		return !NumberType.isDefinitelyNotCompatibleWith(token);
	}

	intersectsWith(otherType) {
		return NumberType.isIntersectingNumberTypes(this, otherType);
	}

	getIntersectionWith(otherType, nameToTypeFactory) {
		if (otherType.name === 'num') {
			let isFiniteOnly = this.isFiniteOnly || otherType.isFiniteOnly;
			let isUnfiniteOnly = this.isUnfiniteOnly || otherType.isUnfiniteOnly;
			if (isFiniteOnly && isUnfiniteOnly)
				return null; // no intersection is possible.
				// any value is either finite or infinite.  It can't be both.

			let resultMin = Math.max(this.min, otherType.min);
			let resultMax = Math.min(this.max, otherType.max);
			if (resultMax < resultMin)
				return null; // indicate no intersection because no value is >= resultMax and <= resultMin.

			return new NumberType(isFiniteOnly, isUnfiniteOnly,
				resultMin, resultMax);
		}

		if ('int' === otherType.name)
			return otherType.getIntersectionWith(this);

		if (otherType.name === 'color')
			return nameToTypeFactory('int');

		return null; // indicate no intersection.
	}

	isSubsetOf(otherType) {
		if (otherType.name === 'int' &&
		this.min === this.max && Number.isInteger(this.min)) {
			if (otherType.min <= this.min)
				return true;
		}
		if (otherType.name !== 'num')
			return false;
		if (otherType.min > this.min ||
		otherType.max < this.max) {
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
			if (n1.max < n2.min ||
			n1.min > n2.max)
				return false;
			if (n1.isFiniteOnly)
				return !n2.isUnfiniteOnly;
			if (n1.isUnfiniteOnly)
				return !n2.isFiniteOnly;
			return true;
		}
		if (n1.name === 'int' && n2.name === 'num')
			[n1, n2] = [n2, n1]; // swap.
		if (n1.name === 'num' && n2.name === 'int') {
			if (n2.max < n1.min || n2.min > n1.max)
				return false;

			return n1.isUnfiniteOnly === false;
		}
		return NumberType.isIntersectableWithNumericType(n1) &&
			NumberType.isIntersectableWithNumericType(n2);
	}

	tightenForValue(value) {
		if (Number.isFinite(value))
			return new NumberType(true, false, value, value);
		else if (value === Infinity || value === -Infinity)
			return new NumberType(false, true, value, value);
		else
			throw new Error(`Can't tighten around a value that is not a number.  value=${value}`);
	}

	toString() {
		const minStr = (this.min === -Infinity ? '' : `min=${this.min}`).toLowerCase();
		const maxStr = (this.max === Infinity ? '' : `max=${this.max}`).toLowerCase();
		let finiteStr = '';
		if (this.isFiniteOnly)
			finiteStr = 'finite';
		else if (this.isUnfiniteOnly)
			finiteStr = 'unfinite';

		const parts = [finiteStr, maxStr, minStr].filter(s => s !== '').join(',');
		if (parts === '')
			return 'num';

		return `num(${parts})`;
	}
};
