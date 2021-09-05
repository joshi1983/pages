import { DataType } from './DataType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

/*
An instruction list is fundamentally different from a data list.
No instruction lists are data lists and no data lists are instruction lists.
*/
export class InstructionListType extends DataType {
	static helpUrl = 'instruction-list.html';

	constructor() {
		super("instructionlist");
	}

	isProperSubsetOf(otherType) {
		return false;
	}

	intersectsWith(otherType) {
		return 'instructionlist' === otherType.name;
	}

	getIntersectionWith(otherType) {
		if (this.intersectsWith(otherType))
			return this;
		return null;
	}

	mayBeCompatibleWithValue(val) {
		return false; // instruction lists can't be calculated at runtime by a Logo program.
	}

	mayBeCompatibleWith(token) {
		if (!DataType.mayBeData(token))
			return false;
		if ([ParseTreeTokenType.NUMBER_LITERAL,
		ParseTreeTokenType.STRING_LITERAL,
		ParseTreeTokenType.BOOLEAN_LITERAL].indexOf(token.type) !== -1)
			return false;

		return true;
	}
};