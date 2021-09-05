import { addTokenEquality } from
'./addTokenEquality.js';
import { ArrayUtils } from
'../../../../../ArrayUtils.js';
import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

export class SimulatedExecutionState {
	constructor() {
		// a map from lower case name to a ParseTreeTokenType.
		this.globalVariables = new Map();
		this.localVariables = new Map();
		this.localVariableNames = new Set();
		this.boundVariables = new Map();
	}

	bindVariables(variableName1, variableName2) {
		const tokenValue = this.getSingleValueToken(variableName2);
		if (tokenValue === undefined)
			return;

		// no reason to maintain information for values that might be mutated when
		// the token type indicates the value can't be mutated.
		// numbers, strings, and boolean values can't be mutated.
		// lists and property lists can be mutated.
		if (tokenValue.type === ParseTreeTokenType.NUMBER_LITERAL ||
		tokenValue.isStringLiteral() ||
		tokenValue.type === ParseTreeTokenType.BOOLEAN_LITERAL)
			return;

		let sharedValue = this.boundVariables.get(variableName2);
		if (sharedValue === undefined)
			sharedValue = new Set([variableName1, variableName2]);
		else
			sharedValue.add(variableName1);

		this.boundVariables.set(variableName1, sharedValue);
	}

	clone() {
		const result = new SimulatedExecutionState();
		result.localVariables = new Map(this.localVariables);
		result.globalVariables = new Map(this.globalVariables);
		result.localVariableNames = new Set(this.localVariableNames);
		result.boundVariables = new Map(this.boundVariables);

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

	forgetAllMutatableGlobalVariables(procedureGlobalEffects) {
		for (const globalName of Array.from(this.globalVariables.keys())) {
			if (!procedureGlobalEffects.unmutatableGlobalVariables.
			has(globalName))
				this.globalVariables.delete(globalName);
		}
	}

	forgetAffectedVariables(affectedInfo, procedureGlobalEffects) {
		if (affectedInfo.hasMutation) {
			this.forgetAllMutatableGlobalVariables(procedureGlobalEffects);
		}
		for (const variableName of affectedInfo.possiblyAffectedGlobalVariables) {
			this.deleteAssociatedValueTokenFor(variableName);
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
	// if nestedRanAtLeastOnce is false,
	// - Forget any variable with inconsistent associated token.
	joinWith(nestedFinalExecutionState, nestedRanAtLeastOnce) {
		if (nestedRanAtLeastOnce !== true)
			nestedRanAtLeastOnce = false;
		for (const name of nestedFinalExecutionState.localVariableNames) {
			this.localVariableNames.add(name);
			// ATTENTION: if nestedRanAtLeastOnce === false, this might be a mistake.
			// We wouldn't know if the variable actually became local in such a case.
		}
		for (const name of this.localVariables.keys()) {
			const otherVariable = nestedFinalExecutionState.localVariables.get(name);
			if (otherVariable === undefined ||
			(!nestedRanAtLeastOnce && otherVariable !== this.localVariables.get(name)))
				this.localVariables.delete(name);
		}
		for (const [name, sharedValue] of nestedFinalExecutionState.boundVariables)
			this.bindVariables(name, sharedValue);
		for (const name of this.globalVariables.keys()) {
			const otherVariable = nestedFinalExecutionState.globalVariables.get(name);
			if (otherVariable === undefined ||
			(!nestedRanAtLeastOnce && otherVariable !== this.globalVariables.get(name)))
				this.globalVariables.delete(name);
		}
		if (nestedRanAtLeastOnce) {
			for (const [name, valueToken] of nestedFinalExecutionState.globalVariables)
				this.globalVariables.set(name, valueToken);

			for (const [name, valueToken] of nestedFinalExecutionState.localVariables)
				this.localVariables.set(name, valueToken);
		}
	}

	isGlobalVariable(lowerCaseName) {
		return !this.localVariableNames.has(lowerCaseName);
	}

	// name is assumed be in lower case.
	make(name, token, isGlobal) {
		if (typeof name !== 'string')
			throw new Error(`name must be a string but found ${name}`);
		if (typeof isGlobal !== 'boolean')
			throw new Error(`isGlobal must be a boolean but found ${isGlobal}`);

		let variableNames = [];
		if (token.type === ParseTreeTokenType.VARIABLE_READ) {
			// For example, make "x :y
			const variableName2 = token.val.toLowerCase(); // For example, "y"
			const valueToken = this.getSingleValueToken(variableName2);
			// For example, valueToken represents the token last assigned to variable y.
			if (valueToken !== undefined)
				token = valueToken;

			variableNames.push(variableName2);
		}
		else {
			ArrayUtils.pushAll(variableNames, getDescendentsOfType(token,
				ParseTreeTokenType.VARIABLE_READ).map(t => t.val.toLowerCase()));
		}
		if (isGlobal)
			this.globalVariables.set(name, token);
		else {
			this.localVariables.set(name, token);
			this.localVariableNames.add(name);
		}
		this.unbindVariable(name);
		for (const name2 of variableNames) {
			this.bindVariables(name, name2);
		}
	}

	variableMutated(variableName) {
		const sharedValue = this.boundVariables.get(variableName);
		if (sharedValue !== undefined) {
			for (const name of Array.from(sharedValue)) {
				this.deleteAssociatedValueTokenFor(name);
				sharedValue.delete(name);
				this.boundVariables.delete(name);
			}
		}
	}

	swapVariables(variableName1, variableName2) {
		const valueToken1 = this.getSingleValueToken(variableName1);
		const valueToken2 = this.getSingleValueToken(variableName2);
		const bindValue1 = this.boundVariables.get(variableName1);
		const bindValue2 = this.boundVariables.get(variableName2);
		if (valueToken1 === undefined)
			this.deleteAssociatedValueTokenFor(variableName2);
		else
			this.make(variableName2, valueToken1, this.isGlobalVariable(variableName2));
		if (bindValue1 === undefined)
			this.boundVariables.delete(variableName2);
		else
			this.bindVariables(variableName2, bindValue1);

		if (valueToken2 === undefined)
			this.deleteAssociatedValueTokenFor(variableName1);
		else
			this.make(variableName1, valueToken2, this.isGlobalVariable(variableName1));

		if (bindValue2 === undefined)
			this.boundVariables.delete(variableName1);
		else
			this.bindVariables(variableName1, bindValue2);
	}

	unbindVariable(variableName) {
		const sharedValue = this.boundVariables.get(variableName);
		if (sharedValue !== undefined) {
			sharedValue.delete(variableName);
			this.boundVariables.delete(variableName);
		}
	}
};