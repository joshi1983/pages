import { addTokenEquality } from
'./addTokenEquality.js';

export class SimulatedExecutionState {
	constructor() {
		// a map from lower case name to a ParseTreeTokenType.
		this.globalVariables = new Map();
		this.localVariables = new Map();
		this.localVariableNames = new Set();
	}

	clone() {
		const result = new SimulatedExecutionState();
		for (const [name, variableInfo] of this.localVariables)
			result.localVariables.set(name, variableInfo);
		for (const [name, variableInfo] of this.globalVariables)
			result.globalVariables.set(name, variableInfo);
		for (const name of this.localVariableNames)
			result.localVariableNames.add(name);

		return result;
	}

	deleteAssociatedValueTokenFor(lowerCaseName) {
		if (this.isGlobalVariable(lowerCaseName))
			this.globalVariables.delete(lowerCaseName);
		else
			this.localVariables.delete(lowerCaseName);
	}

	// Returns fromToken if anything was actually stored.  
	equateVariableToToken(variableName, readToken, result) {
		if (typeof variableName !== 'string')
			throw new Error(`variableName must be a string but found ${variableName}`);
		if (typeof readToken !== 'object')
			throw new Error(`readToken must be an object but found ${readToken}`);
		if (!(result instanceof Map))
			throw new Error(`result must be a Map but found ${result}`);

		let map;
		if (this.localVariables.has(variableName))
			map = this.localVariables;
		else if (!this.localVariableNames.has(variableName)) {
			map = this.globalVariables;
		}
		if (map !== undefined) {
			const fromToken = map.get(variableName);
			if (fromToken !== undefined) {
				addTokenEquality(fromToken, readToken, result);
				return fromToken;
			}
		}
	}

	forgetAllGlobalVariables() {
		this.globalVariables = new Map();
	}

	getSingleValueToken(variableName) {
		if (this.localVariableNames.has(variableName))
			return this.localVariables.get(variableName);
		else
			return this.globalVariables.get(variableName);
	}

	// nestedFinalExecutionState should be another instance of SimulatedExecutionState.
	joinWith(nestedFinalExecutionState) {
		for (const name of nestedFinalExecutionState.localVariableNames)
			this.localVariableNames.add(name);

		for (const name of this.localVariables.keys()) {
			const otherVariable = nestedFinalExecutionState.localVariables.get(name);
			if (otherVariable === undefined)
				this.localVariables.delete(name);
		}
		for (const name of this.globalVariables.keys()) {
			const otherVariable = nestedFinalExecutionState.globalVariables.get(name);
			if (otherVariable === undefined)
				this.globalVariables.delete(name);
		}
	}

	isGlobalVariable(lowerCaseName) {
		return !this.localVariableNames.has(lowerCaseName);
	}

	make(name, token, isGlobal) {
		if (typeof name !== 'string')
			throw new Error(`name must be a string but found ${name}`);
		if (typeof isGlobal !== 'boolean')
			throw new Error(`isGlobal must be a boolean but found ${isGlobal}`);

		if (isGlobal)
			this.globalVariables.set(name, token);
		else {
			this.localVariables.set(name, token);
			this.localVariableNames.add(name);
		}
	}

	swapVariables(variableName1, variableName2) {
		const valueToken1 = this.getSingleValueToken(variableName1);
		const valueToken2 = this.getSingleValueToken(variableName2);
		if (valueToken1 === undefined)
			this.deleteAssociatedValueTokenFor(variableName2);
		else
			this.make(variableName2, valueToken1, this.isGlobalVariable(variableName2));
		if (valueToken2 === undefined)
			this.deleteAssociatedValueTokenFor(variableName1);
		else
			this.make(variableName1, valueToken2, this.isGlobalVariable(variableName1));
	}
};