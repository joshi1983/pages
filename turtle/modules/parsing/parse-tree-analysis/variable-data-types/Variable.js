import { binarySearch } from '../../../binarySearch.js';
import { compareVariableScopes } from './compareVariableScopes.js';
import { DataTypes } from '../../data-types/DataTypes.js';
import { getProcedureFromAnyTokenInProcedure } from './getProcedureFromAnyTokenInProcedure.js';
import { isAfterOrSame } from '../../isAfterOrSame.js';

/*
A Variable is identified by its name.  If the name is the same, it is considered the same variable.
A Variable can have many associated VariableScope's.  The "scope" corresponds with places where a variable's value changes.
*/
export class Variable {
	constructor(name) {
		this.name = name.toLowerCase();
		this.scopes = [];
	}

	addScope(scope) {
		if (this.scopes.length === 0 || isAfterOrSame(scope.assignToken, this.scopes[this.scopes.length - 1].assignToken)) {
			this.scopes.push(scope);
		}
		else {
			let index = binarySearch(this.scopes, compareVariableScopes, scope, true);
			this.scopes.splice(index, 0, scope);
		}
		scope.setVariable(this);
	}

	getFirstScopeInProcedure(procedure) {
		const instructionListToken = procedure.getInstructionListToken();
		const scopes = this.getScopesAt(instructionListToken, procedure);
		return scopes[0];
	}

	getLocalScopesAt(location) {
		let result = this.scopes.filter(s => s.containsLocal(location));
		if (result.length > 1) {
			const applicableScopes = result.filter(s => s.applicableTokens.has(location));
			if (applicableScopes.length !== 0)
				result = applicableScopes;
		}
		return result;
	}

	getRequiredTypesAtToken(token) {
		const procedure = getProcedureFromAnyTokenInProcedure(token);
		const scopes = this.getScopesAt(token, procedure);
		if (scopes.length === 1) {
			const scope = scopes[0];
			return scope.requiredTypes;
		}
		else if (scopes.length === 0) {
			return new DataTypes(DataTypes.getAllAssignableDataTypes());
		}
		else {
			const result = new DataTypes(scopes[0].requiredTypes);
			for (let i = 1; i < scopes.length; i++) {
				result.addTypes(scopes[i].requiredTypes);
			}
			return result;
		}
	}

	getScopesArray() {
		return this.scopes;
	}

	getScopesAt(location, procedure) {
		if (location === null)
			throw new Error('location must not be null');
		let result = this.scopes.filter(s => s.contains(location, procedure));
		if (result.length > 1) {
			const applicableScopes = result.filter(s => s.applicableTokens.has(location));
			if (applicableScopes.length !== 0)
				result = applicableScopes;
		}
		if (result.length <= 1 || procedure === undefined)
			return result;
		else {
			// return local scopes only if procedure is specified and there is at least 1 matching local scope.
			// This extra filtering is helpful because the caller usually wants scopes applicable to reading and writing this variable.
			// The most local scope or scopes are the ones applicable for reading and writing at the specified location.
			const localScopes = result.filter(s => s.procedure !== undefined);
			if (localScopes.length !== 0)
				return localScopes;
			else
				return result;
		}
	}

	getTypesAtToken(token) {
		const procedure = getProcedureFromAnyTokenInProcedure(token);
		const scopes = this.getScopesAt(token, procedure);
		if (scopes.length === 1) {
			const scope = scopes[0];
			if (scope.assignedTypes.isEmpty())
				return scope.requiredTypes;
			else
				return scope.assignedTypes;
		}
		else if (scopes.length === 0) {
			return new DataTypes(DataTypes.getAllAssignableDataTypes());
		}
		else {
			const result = new DataTypes(scopes[0].assignedTypes);
			for (let i = 1; i < scopes.length; i++) {
				result.addTypes(scopes[i].assignedTypes);
			}
			return result;
		}
	}

	hasAGlobalScope() {
		return this.scopes.some(scope => scope.procedure === undefined);
	}
};