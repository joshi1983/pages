import { Variable } from './Variable.js';

function compareByName(v1, v2) {
	return v1.name.localeCompare(v2.name);
}

export class Variables {
	constructor(vars) {
		this.variableMap = new Map();
		this.setMap(vars);
	}

	setMap(vars) {
		if (!(vars instanceof Map))
			throw new Error('vars must be an instance of Map');

		this.varsMap = vars;
		this.variableMap.clear();
	}

	getDivs() {
		const variables = [];
		const outer = this;
		for (const [name, value] of this.varsMap) {
			if (!this.variableMap.has(name))
				this.variableMap.set(name, new Variable(name, function() {
					return outer.varsMap.get(name);
				}));
			variables.push(this.variableMap.get(name));
		}
		variables.sort(compareByName);
		return variables.map(function(variable) {
			return variable.getDiv();
		});
	}
};