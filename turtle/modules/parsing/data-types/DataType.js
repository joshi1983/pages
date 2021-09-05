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

	isSubsetOf(otherType) {
		return this.isProperSubsetOf(otherType) || this.equals(otherType);
	}
}
