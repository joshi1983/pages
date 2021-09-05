import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export class DataType {
	constructor(name) {
		this.name = name;
	}

	isUnionOfSubtypes() {
		return false;
	}

	static mayBeData(token) {
		return [ParseTreeTokenType.NEW_LINE,
		ParseTreeTokenType.PROCEDURE_END_KEYWORD,
		ParseTreeTokenType.LEAF].
		indexOf(token.type) === -1;
	}

	toString() {
		return this.name;
	}

	intersectsWith(otherType) {
		return this.name === otherType.name;
	}

	equals(otherType) {
		return this.name === otherType.name;
	}

	isProperSubsetOf(otherType) {
		return false;
	}

	isSubsetOf(otherType, DataTypes) {
		if (DataTypes === undefined || DataTypes.name !== 'DataTypes')
			throw new Error(`DataTypes must be specified to work around a module import cycle.  DataTypes was instead specified as ${DataTypes}`);
		return this.isProperSubsetOf(otherType, DataTypes) || this.equals(otherType);
	}
}
