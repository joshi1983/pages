import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const neverDataTypes = new Set([
	ParseTreeTokenType.COMMENT,
	ParseTreeTokenType.LEAF,
	ParseTreeTokenType.NEW_LINE,
	ParseTreeTokenType.PROCEDURE_END_KEYWORD,
	ParseTreeTokenType.PROCEDURE_START_KEYWORD,
	ParseTreeTokenType.TREE_ROOT
]);

export class DataType {
	constructor(name) {
		this.name = name;
	}

	isUnionOfSubtypes() {
		return false;
	}

	static mayBeData(token) {
		return !neverDataTypes.has(token.type);
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
