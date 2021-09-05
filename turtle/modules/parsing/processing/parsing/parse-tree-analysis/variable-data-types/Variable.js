import { getMostNarrowScope } from './getMostNarrowScope.js';

export class Variable {
	constructor(name) {
		this.name = name; // the name is case-sensitive in Processing.
		this.scopes = [];
	}

	addScope(scope) {
		scope.setVariable(this);
		this.scopes.push(scope);
	}

	getScopesArray() {
		return this.scopes;
	}

	getScopeAt(location, method) {
		let scopes = this.scopes.filter(s => s.contains(location, method));
		if (scopes.length <= 1)
			return scopes[0];
		if (method !== undefined) {
			const localScopes = scopes.filter(scope => scope.method !== undefined);
			if (localScopes.length !== 0)
				scopes = localScopes;
		}
		return getMostNarrowScope(scopes);
	}
};