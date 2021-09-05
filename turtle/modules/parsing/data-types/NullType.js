import { Command } from '../Command.js';
import { DataType } from './DataType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
await Command.asyncInit();

/*
NullType represents an empty set of values.
It can be used for the equivalent of void functions if void means what it does in c.

All valid values that can be stored in WebLogo variables are not null.
If something like JavaScript's null or undefined creeps into a WebLogo variable, it represents a problem.
	Ideally, when a null or undefined gets in a WebLogo variable, 
	the program would halt immediately with an error message describing the issue.
*/
export class NullType extends DataType {
	constructor() {
		super("null");
	}

	getIntersectionWith(otherType) {
		if (otherType === null || 'null' === otherType.name)
			return this;

		return null;
	}

	intersectsWith(otherType) {
		return otherType === null || otherType.name === 'null';
	}

	isProperSubsetOf(otherType) {
		return false;
	}

	mayBeCompatibleWith(token) {
		if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
			return false;
		const info = Command.getCommandInfo(token.val);
		return info === undefined || info.returnTypes === null;
	}
};