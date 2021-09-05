import { DataType } from './DataType.js';
import { isNumber } from
'../../isNumber.js';
import { NumberType } from './NumberType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export class IntegerType extends DataType {
	static helpUrl = 'integer.html';

	constructor(max,min) {
		if (!isNumber(max))
			max = Infinity;
		if (!isNumber(min))
			min = -Infinity;
		if (max < min)
			throw new Error(`max(${max}) must be at least min(${min}).`);

		super("int");
		this.max = max;
		this.min = min;
	}
	
	equals(otherType) {
		return otherType.min === this.min &&
			otherType.max === this.max &&
			otherType.name === 'int';
	}

	intersectsWith(otherType) {
		return NumberType.isIntersectingNumberTypes(this, otherType);
	}

	static isDefinitelyCompatibleWith(token) {
		if (token.type !== ParseTreeTokenType.NUMBER_LITERAL)
			return false;

		return Number.isInteger(token.val);
	}

	isProperSubsetOf(otherType) {
		if (otherType.name === 'num') {
			if (otherType.isUnfiniteOnly ||
			otherType.min > this.min ||
			otherType.max < this.max)
				return false;

			return true;
		}
		if (otherType.name === 'int') {
			if (this.min < otherType.min ||
			this.max > otherType.max)
				return false;

			if (this.min === otherType.min &&
			this.max === otherType.max)
				return false;
				// equal sets are not proper subsets.

			return true;
		}
		if (['alphacolor', 'color'].indexOf(otherType.name) !== -1) {
			if (this.min > 0 || this.max < 255)
				return false;
			return true;
		}
		return false;
	}

	getIntersectionWith(otherType) {
		if (otherType.name === 'num') {
			if (otherType.isUnfiniteOnly)
				return null; // Infinity and -Infinity are not considered integers.

			if (Math.ceil(otherType.min) === this.min &&
			Math.floor(otherType.max) === this.max)
				return this;

			if (otherType.max < this.min)
				return null; // there is no intersection if the maximum number from 
				// otherType is less than the smallest in this.

			return new IntegerType(Math.min(otherType.max, this.max),
			Math.max(otherType.min, this.min));
				// FIXME: if/when IntegerType supports max, that should be factored into this intersection.
		}
		if (otherType.name === 'int') {
			const min = Math.max(this.min, otherType.min);
			const max = Math.min(this.max, otherType.max);
			if (min === this.min && max === this.max)
				return this;

			if (otherType.min === min && otherType.max === max)
				return otherType;

			if (max < min)
				return null; // no intersection

			return new IntegerType(max, min);
		}
		if ('color' === otherType.name) {
			if (this.min === -Infinity && this.max === Infinity)
				return this;
			else
				return new IntegerType();
		}
		return null; // indicate empty/no intersection
	}

	static mayBeCompatibleWithValue(val) {
		return Number.isInteger(val);
	}

	mayBeCompatibleWith(token) {
		if (IntegerType.mayBeInt(token)) {
			if (Number.isInteger(token.val))
				return this.min <= token.val &&
				this.max >= token.val;
			return true;
		}
		return false;
	}

	mayBeCompatibleWithValue(value) {
		if (!Number.isInteger(value))
			return false;

		return value >= this.min &&
			value <= this.max;
	}

	static mayBeInt(token) {
		if (!DataType.mayBeData(token))
			return false;

		if (NumberType.isDefinitelyNotCompatibleWith(token))
			return false;

		if (token.type === ParseTreeTokenType.NUMBER_LITERAL &&
		!Number.isInteger(token.val))
			return false;

		return true;
	}

	tightenForValue(value) {
		if (Number.isInteger(value))
			return new IntegerType(value, value);
		else
			throw new Error(`Can't tighten around a value that is not an integer.  value=${value}`);
	}

	toString() {
		const maxStr = this.max < Number.MAX_SAFE_INTEGER ? `max=${this.max}` : '';
		const minStr = this.min > -Number.MAX_SAFE_INTEGER ? `min=${this.min}` : '';
		const part = [maxStr, minStr].filter(s => s !== '').join(',');
		if (part === '')
			return 'int';
		else
			return `int(${part})`;
	}
};