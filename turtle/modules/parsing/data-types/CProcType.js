import { ColorStringType } from './ColorStringType.js';
import { Command } from '../Command.js';
import { DataType } from './DataType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { validateIdentifier } from '../parse-tree-analysis/validateIdentifier.js';

async function asyncInit() {
	await ColorStringType.asyncInit();
	// not awaiting on Command.asyncInit() because of a cycle.
	// Command.asyncInit() awaits DataTypes.asyncInit() which awaits CProcType.asyncInit().
}
const initPromise = asyncInit();

function isCommandCompatible(info, numArgs) {
	const count = Command.getArgCount(info);
	if (count.defaultCount === numArgs)
		return true;
	else {
		if (typeof info.argCount === 'object') {
			if (info.argCount.min !== undefined && numArgs < info.argCount.min)
				return false;
			if (info.argCount.max !== undefined && numArgs > info.argCount.max)
				return false;
		}
		return count.isFlexible;
	}
}

/*
Names of commands or procedures.

When numArgs is an integer, it represents the number of arguments this set of commands or procedures must support.
*/
export class CProcType extends DataType {
	// The caller must separately ensure that Command.asyncInit() resolves.
	static asyncInit() {
		return initPromise;
	}

	constructor(numArgs) {
		if (numArgs !== undefined && (!Number.isInteger(numArgs) || numArgs < 0))
			throw new Error('numArgs must be either undefined or a positive integer.  Not: ' + numArgs);
		if (numArgs === undefined)
			super("cproc");
		else
			super("cproc:" + numArgs);
		this.numArgs = numArgs;
	}

	static parseName(name) {
		const index = name.indexOf(':');
		if (index === -1)
			return new CProcType(undefined);
		else {
			const numArgs = parseInt(name.substring(index + 1));
			if (Number.isInteger(numArgs))
				return new CProcType(numArgs);
			else
				return new CProcType();
		}
	}

	getIntersectionWith(otherType) {
		if (['color', 'colorstring'].indexOf(otherType.name) !== -1)
			return new ColorStringType();
		if (otherType.name === 'string')
			return this;
		if (otherType.name.startsWith('cproc')) {
			if (this.numArgs === undefined)
				return otherType;
			if (otherType.numArgs === undefined || otherType.numArgs === this.numArgs)
				return this;
		}
		return null;
	}

	intersectsWith(otherType) {
		if (otherType.name.startsWith('cproc')) {
			return (otherType.numArgs === undefined || this.numArgs === undefined) ||
				otherType.numArgs === this.numArgs;
		}
		return ['color', 'colorstring', 'string'].indexOf(otherType.name) !== -1;
	}

	isProperSubsetOf(otherType) {
		if (otherType.name.startsWith('cproc')) {
			if (otherType.numArgs === undefined && this.numArgs !== undefined)
				return true;
			else
				return false;
		}
		return ['string'].indexOf(otherType.name) !== -1;
	}

	mayBeCompatibleWithValue(val, extraInfo) {
		if (typeof val !== 'string')
			return false;
		if (validateIdentifier(val) !== undefined)
			return false;
		val = val.toLowerCase();
		const info = Command.getCommandInfo(val);
		if (info !== undefined) {
			if (this.numArgs === undefined)
				return true;
			if (!isCommandCompatible(info, this.numArgs))
				return false;
		}
		else if (extraInfo !== undefined && extraInfo.procedures instanceof Map) {
			const proc = extraInfo.procedures.get(val);
			if (proc === undefined)
				return false;
			if (proc.parameters.length !== this.numArgs && this.numArgs !== undefined)
				return false;
		}
		return true;
	}

	mayBeCompatibleWith(token, extraInfo) {
		if (!DataType.mayBeData(token))
			return false;
		if (token.isStringLiteral())
			return this.mayBeCompatibleWithValue(token.val, extraInfo);
		if ([ParseTreeTokenType.VARIABLE_READ, 
		ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
		ParseTreeTokenType.PARAMETERIZED_GROUP].indexOf(token.type) !== -1)
			return true;
		return false;
	}
};
