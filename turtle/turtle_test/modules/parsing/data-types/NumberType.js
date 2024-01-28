import { DataType } from './DataType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export class NumberType extends DataType {
	static helpUrl = 'number.html';

	static intType = new NumberType();
	static {
		NumberType.intType.name = 'int';
	}

	constructor() {
		super("num");
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
		return typeof val === 'number' && !isNaN(val);
	}

	mayBeCompatibleWith(token) {
		return !NumberType.isDefinitelyNotCompatibleWith(token);
	}

	intersectsWith(otherType) {
		return NumberType.isIntersectingNumberTypes(this, otherType);
	}

	getIntersectionWith(otherType, nameToTypeFactory) {
		if (['int', 'num'].indexOf(otherType.name) !== -1)
			return otherType;
		if (otherType.name === 'color')
			return nameToTypeFactory('int');

		return null;
	}

	static isIntersectableWithNumericType(type1) {
		return ['color', 'int', 'num'].indexOf(type1.name);
	}

	static isIntersectingNumberTypes(n1, n2) {
		return NumberType.isIntersectableWithNumericType(n1) &&
			NumberType.isIntersectableWithNumericType(n2);
	}
}