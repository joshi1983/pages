import { Command } from '../Command.js';
import { DataType } from './DataType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
await Command.asyncInit();

export class NullType extends DataType {
	constructor() {
		super("null");
	}

	mayBeCompatibleWith(token) {
		if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
			return false;
		const info = Command.getCommandInfo(token.val);
		return info === undefined || info.returnTypes === null;
	}

	intersectsWith(otherType) {
		return otherType === null || otherType.name === 'null';
	}

	isProperSubsetOf(otherType) {
		return false;
	}

	getIntersectionWith(otherType) {
		if (otherType === null || 'null' === otherType.name)
			return this;

		return null;
	}
};