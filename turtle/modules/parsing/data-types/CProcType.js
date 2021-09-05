import { areDataTypesContaining } from './areDataTypesContaining.js';
import { ColorStringType } from './ColorStringType.js';
import { Command } from '../Command.js';
import { DataType } from './DataType.js';
import { DataTypes } from './DataTypes.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { validateIdentifier } from '../parse-tree-analysis/validateIdentifier.js';

async function asyncInit() {
	await ColorStringType.asyncInit();
	// not awaiting on Command.asyncInit() because of a cycle.
	// Command.asyncInit() awaits DataTypes.asyncInit() which awaits CProcType.asyncInit().
}
const initPromise = asyncInit();

function areReturnTypesEqual(returnTypes1, returnTypes2) {
	if (returnTypes1 === returnTypes2)
		return true;
	if (returnTypes1 === undefined || returnTypes1 === null)
		return false;
	if (returnTypes2 === null)
		return false;
	return DataTypes.stringify(returnTypes1) === DataTypes.stringify(returnTypes2);
}

function isCommandCompatibleWithArgumentCount(info, numArgs) {
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
	static helpUrl = 'cproc.html';

	// The caller must separately ensure that Command.asyncInit() resolves.
	static asyncInit() {
		return initPromise;
	}

	constructor(numArgs, returnTypes) {
		if (numArgs !== undefined && (!Number.isInteger(numArgs) || numArgs < 0))
			throw new Error('numArgs must be either undefined or a positive integer.  Not: ' + numArgs);
		if (returnTypes !== undefined && returnTypes !== null && !(returnTypes instanceof Set))
			throw new Error(`returnTypes must be a Set or null if it is defined but found ${returnTypes}`);

		if (numArgs === undefined)
			super("cproc");
		else
			super("cproc:" + numArgs);
		this.numArgs = numArgs;
		this.returnTypes = returnTypes;
	}

	equals(otherType) {
		if (this.name !== otherType.name ||
		this.numArgs !== otherType.numArgs)
			return false;
		if (this.returnTypes === otherType.returnTypes)
			return true;
		if (this.returnTypes === undefined || this.returnTypes === null)
			return false; // because otherType.returnTypes must be different here.

		return new DataTypes(this.returnTypes).equals(new DataTypes(otherType.returnTypes));
	}

	getIntersectionWith(otherType) {
		if (['color', 'colorstring'].indexOf(otherType.name) !== -1)
			return new ColorStringType();
		if (otherType.name === 'string')
			return this;
		if (otherType.name.startsWith('cproc')) {
			if (this.returnTypes === undefined) {
				if (this.numArgs === undefined)
					return otherType;
				if (otherType.numArgs === undefined || otherType.numArgs === this.numArgs)
					return this;
			}
			else if (otherType.returnTypes === undefined) {
				if (otherType.numArgs === undefined)
					return this;
				if (this.numArgs === undefined || otherType.numArgs === this.numArgs)
					return otherType;
			}
			else if (this.numArgs === otherType.numArgs ||
			this.numArgs === undefined || otherType.numArgs === undefined) {
				const returnTypes = DataTypes.intersect(this.returnTypes, otherType.returnTypes);
				if (returnTypes.size === 0 && this.returnTypes.size !== 0)
					return null; // indicate no intersection.

				const numArgs = this.numArgs === undefined ? otherType.numArgs : this.numArgs;
				return new CProcType(numArgs, returnTypes);
			}
		}
		return null;
	}

	intersectsWith(otherType) {
		if (otherType.name.startsWith('cproc')) {
			if (this.returnTypes !== undefined && otherType.returnTypes !== undefined
			&& this.returnTypes !== otherType.returnTypes) {
				if (this.returnTypes === null || otherType.returnTypes === null)
					return false;
				if (!(new DataTypes(this.returnTypes).hasIntersectionWith(otherType.returnTypes)))
					return false;
			}
			return (otherType.numArgs === undefined || this.numArgs === undefined) ||
				otherType.numArgs === this.numArgs;
		}
		return ['color', 'colorstring', 'string'].indexOf(otherType.name) !== -1;
	}

	isProperSubsetOf(otherType) {
		if (otherType.name.startsWith('cproc')) {
			if (this.returnTypes === undefined) {
				if (otherType.returnTypes !== undefined)
					return false;
			}
			else {
				if (otherType.returnTypes === undefined) {
					if (otherType.numArgs === undefined ||
					otherType.numArgs === this.numArgs)
						return true;
					else
						return false;
				}
				else if (this.returnTypes !== otherType.returnTypes &&
				otherType.returnTypes !== null) {
					if (this.returnTypes === null)
						return false;

					const thisReturnTypes = DataTypes.stringify(this.returnTypes);
					const otherReturnTypes = DataTypes.stringify(otherType.returnTypes);
					if (thisReturnTypes !== otherReturnTypes) {
						if (areDataTypesContaining(this.returnTypes, otherType.returnTypes))
							return false;
						else if (areDataTypesContaining(otherType.returnTypes, this.returnTypes)) {
							if (this.numArgs === otherType.numArgs || this.numArgs === undefined)
								return true;
						}
					}
				}
			}
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
			if (this.returnTypes !== undefined) {
				if (this.returnTypes === null && info.returnTypes !== null)
					return false;
				if (info.returnTypes === null && this.returnTypes !== null)
					return false;
				if (!areDataTypesContaining(this.returnTypes, Command.getReturnDataTypes(info).types))
					return false;
			}
			if (this.numArgs === undefined)
				return true;
			if (!isCommandCompatibleWithArgumentCount(info, this.numArgs))
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

	static parseName(name, returnTypes) {
		const index = name.indexOf(':');
		if (index === -1)
			return new CProcType(undefined, returnTypes);
		else {
			const numArgs = parseInt(name.substring(index + 1));
			if (Number.isInteger(numArgs))
				return new CProcType(numArgs, returnTypes);
			else
				return new CProcType(undefined, returnTypes);
		}
	}

	tightenForValue(value) {
		let numParameters;
		let returnTypes;
		const info = Command.getCommandInfo(value);
		if (info !== undefined) {
			const argCount = Command.getArgCount(info);
			if (!argCount.isFlexible)
				numParameters = argCount.defaultCount;
			if (info.returnTypes === null)
				returnTypes = null;
			else
				returnTypes = Command.getReturnDataTypes(info).types;
		}
		return new CProcType(numParameters, returnTypes);
	}

	toString() {
		let result = super.toString();
		if (this.returnTypes !== undefined) {
			let returnTypesStr = null;
			if (this.returnTypes !== null)
				returnTypesStr = DataTypes.stringify(this.returnTypes);
			result += `(returntypes=${returnTypesStr})`;
		}
		return result;
	}

	// Returns a CProcType if a single instance of CProcType can accurately 
	// describe the union of this with otherCProcType.
	// Returns undefined otherwise.
	unionWith(otherCProcType) {
		if (!otherCProcType.name.startsWith('cproc'))
			throw new Error(`otherCProcType must be a CProcType`);
		if ((this.numArgs === undefined && this.returnTypes === undefined) ||
		(otherCProcType.numArgs === undefined && otherCProcType.returnTypes === undefined))
			return new CProcType(undefined, undefined);
		else if (areReturnTypesEqual(otherCProcType.returnTypes, this.returnTypes)) {
			if (this.numArgs === undefined || otherCProcType.numArgs === undefined)
				return new CProcType(undefined, this.returnTypes);
			if (this.numArgs !== otherCProcType.numArgs)
				return undefined; // no way to union without loss of the original 2 distinct numArgs values.
			return new CProcType(this.numArgs, this.returnTypes);
		}
		else if (this.numArgs === otherCProcType.numArgs) {
			if (this.returnTypes === undefined || otherCProcType.returnTypes === undefined)
				return new CProcType(this.numArgs, undefined);
			if (this.returnTypes === null || otherCProcType.returnTypes === null)
				return undefined; // unable to union null with any other return types.
			// union the return types.
			const unionedReturnTypes = DataTypes.union(this.returnTypes, otherCProcType.returnTypes);
			return new CProcType(this.numArgs, unionedReturnTypes);
		}
	}
};
