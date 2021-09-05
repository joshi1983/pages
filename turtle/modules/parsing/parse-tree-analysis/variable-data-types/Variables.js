import { ArrayUtils } from '../../../ArrayUtils.js';

export class Variables {
	constructor() {
		this.variables = new Map();
	}

	addVariable(newVar) {
		if (this.variables.has(newVar.name))
			throw new Error('A variable named ' + newVar.name + ' is already stored so we can not add it');
		this.variables.set(newVar.name, newVar);
	}

	countVariables() {
		return this.variables.size;
	}

	getAllScopesAsArray() {
		const result = [];
		for (const variable of this.variables.values()) {
			ArrayUtils.pushAll(result, variable.getScopesArray());
		}
		return result;
	}

	getAllVariablesAsArray() {
		return Array.from(this.variables.values());
	}

	getGlobalVariableNameSet() {
		const result = new Set();
		for (let variable of this.variables.values()) {
			if (variable.hasAGlobalScope())
				result.add(variable.name);
		}
		return result;
	}

	getVariableByName(name) {
		name = name.toLowerCase();
		return this.variables.get(name);
	}

	hasVariable(name) {
		return this.variables.has(name);
	}
};