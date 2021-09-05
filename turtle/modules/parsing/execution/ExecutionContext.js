import { getCommandGroups } from '../../command-groups/getCommandGroups.js';

export class ExecutionContext {
	constructor(turtle, logoProgram) {
		if (typeof turtle !== 'object')
			throw new Error('turtle must be an object');
		if (typeof logoProgram !== 'object' ||
		logoProgram.procedures === undefined ||
		logoProgram.instructions === undefined)
			throw new Error('logoProgram must be an object with the properties procedures and instructions.');

		for (let [key, value] of getCommandGroups(turtle)) {
			this[key] = value;
		}
		this.globalVariables = new Map();
		this.procedureStack = [];
		this.repcountStack = [];
		this.forcountStack = [];
		this.valueStack = [];
		this.instructionIndex = 0;
		this.logoProgram = logoProgram;
	}

	dequeue(varName) {
		let list1 = this.readVariable(varName);
		if (!(list1 instanceof Array))
			throw new Error('The referenced variable with name "' + varName + '" must be a list but got ' + list1);

		const result = list1[0];
		list1 = list1.slice(0);
		list1.shift(1);
		this.make(varName, list1);
		return result;
	}

	getCurrentExecutingProcedure() {
		return this.procedureStack[this.procedureStack.length - 1];
	}

	getNextInstruction() {
		if (this.procedureStack.length === 0)
			return this.logoProgram.instructions[this.instructionIndex];
		else
			return this.procedureStack[this.procedureStack.length - 1].procedure.instructions[this.instructionIndex];
	}

	// variableName assumed to be in lower case
	localmake(variableName, value) {
		const proc = this.getCurrentExecutingProcedure();
		proc.localVariables.set(variableName, value);
	}

	// variableName assumed to be in lower case
	make(variableName, value) {
		if (typeof variableName !== 'string')
			throw new Error('make requires variableName to be a string.  Not: ' + variableName);
		const proc = this.getCurrentExecutingProcedure();
		if (proc && proc.localVariables.has(variableName))
			proc.localVariables.set(variableName, value);
		else
			this.globalVariables.set(variableName, value);
	}

	readVariable(variableName) {
		var result;
		// check for a matching local variable.
		if (this.procedureStack.length > 0) {
			const proc = this.getCurrentExecutingProcedure();
			result = proc.localVariables.get(variableName);
		}
		if (result === undefined)
			result = this.globalVariables.get(variableName);
		if (result === undefined)
			result = null;
		return result;
	}

	repcount() {
		if (this.repcountStack.length === 0)
			return 0;// weird case but avoid error.

		return this.repcountStack[this.repcountStack.length - 1].current;
	}
};