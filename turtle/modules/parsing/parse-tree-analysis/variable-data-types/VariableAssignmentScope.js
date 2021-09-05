import { compareTokenLocations } from '../../parse-tree-token/compareTokenLocations.js';
import { DataTypes } from '../../data-types/DataTypes.js';
import { simpleContains } from './simpleContains.js';

export class VariableAssignmentScope {
	/*
	assignToken is where the associated variable or parameter is given a new value, 
		the value applicable to this scope.
	fromIndex and toIndex are character indexes within the code.
	assignedTypes are all the possible data types assigned to the variable prior to the fromIndex.
	requiredTypes are all the data types that satisfy variable reading requirements. 
	For example, "fd :x" would require variable x to be a "num" and nothing less specific than that.
	procedure is to be undefined unless this scope is within a procedure.
	*/
	constructor(assignToken, fromToken, toToken, assignedTypes, requiredTypes, procedure, isParameter, singleValue) {
		if (typeof fromToken !== 'object')
			throw new Error('fromToken must be an object');
		if (typeof toToken !== 'object')
			throw new Error('toToken must be an object');
		if (fromToken === null)
			throw new Error('fromToken must not be null');
		if (toToken === null)
			throw new Error('toToken must not be null');
		if (isParameter === undefined)
			isParameter = false;

		this.assignToken = assignToken;
		this.fromToken = fromToken;
		this.toToken = toToken;
		/*
		The fromToken and toToken represents a range of tokens that might apply to this scope.
		applicableTokens represents tokens that are definitely and exclusively applicable.
		*/
		this.applicableTokens = new Set();
		this.assignedTypes = assignedTypes;
		this.requiredTypes = requiredTypes;
		this.procedure = procedure;
		this.isGlobalAccessible = true;
		this.assignTokenProcedure = procedure;
		this.possiblyUsedInAProcedure = true;
		this.isParameter = isParameter;
		this.singleValue = singleValue;
		this.lastSingleValueToken = undefined;
		this.conditionalRanges = [];
	}

	clone() {
		const result = new VariableAssignmentScope(this.assignToken, this.fromToken, this.toToken, 
			this.assignedTypes, this.requiredTypes, this.procedure, this.isParameter, this.singleValue);
		result.isGlobalAccessible = this.isGlobalAccessible;
		result.assignTokenProcedure = this.assignTokenProcedure;
		return result;
	}

	/*
	location should be an object with colIndex and lineIndex properties.  It will usually be ParseTreeToken.
	*/
	contains(location, procedure) {
		if (procedure === undefined) {
			if (this.procedure !== undefined || this.isGlobalAccessible === false)
				return false;
			return simpleContains(this, location);
		}
		else if (this.procedure === undefined) {
			if (!this.possiblyUsedInAProcedure) {
				if (this.assignTokenProcedure === undefined || this.assignTokenProcedure.name !== procedure.name)
					return false;
			}
			if (this.procedure === undefined) {
				// Clearly, this scope corresponds with a global variable but was it assigned within the same procedure?
				// If it was assigned within the same procedure, we still need to check that the range matches.
				// If it was not assigned in the same procedure, we can return true immediately.
				if (this.assignTokenProcedure === undefined || this.assignTokenProcedure.name !== procedure.name)
					return true;
			}
			return simpleContains(this, location);
		}
		else {
			return procedure.name === this.procedure.name &&
				simpleContains(this, location);
		}
	}

	containsLocal(location) {
		return this.procedure !== undefined &&
			compareTokenLocations(this.fromToken, location) <= 0 &&
			compareTokenLocations(this.toToken, location) >= 0;
	}

	equals(otherScope) {
		if (!(otherScope instanceof VariableAssignmentScope))
			return false;
		if (this.singleValue !== otherScope.singleValue)
			return false;
		return compareTokenLocations(this.fromToken, otherScope.fromToken) === 0 &&
			compareTokenLocations(this.toToken, otherScope.toToken) === 0 &&
			compareTokenLocations(this.assignToken, otherScope.assignToken) === 0;
	}

	getConditionalRangeAt(token) {
		if (this.conditionalRanges.length <= 1)
			return this.conditionalRanges[0];
		let bestRange;
		for (let i = 0; i < this.conditionalRanges.length; i++) {
			const range = this.conditionalRanges[i];
			if (range.containsTokenLocation(token)) {
				if (bestRange === undefined ||
				compareTokenLocations(bestRange.fromToken, range.fromToken) < 0)
					bestRange = range;
			}
		}
		return bestRange;
	}

	intersectsRangeWith(scope) {
		return simpleContains(this, scope.fromToken) ||
			simpleContains(this, scope.toToken) ||
			simpleContains(scope, this.fromToken) ||
			simpleContains(scope, this.toToken);
	}

	isSingleValueApplicableAt(location, procedure) {
		if (this.isParameter && this.conditionalRanges.length !== 0)
			return false;
		const conditionalRange = this.getConditionalRangeAt(location);
		if (conditionalRange !== undefined)
			return false;
		return this.contains(location, procedure) &&
			(this.lastSingleValueToken === undefined ||
			(compareTokenLocations(location, this.lastSingleValueToken) <= 0 &&
			compareTokenLocations(location, this.assignToken) >= 0));
	}

	setSingleValue(singleValue, extraInfo) {
		this.singleValue = singleValue;
		if (singleValue !== undefined) {
			this.assignedTypes = new DataTypes(DataTypes.getTypesCompatibleWithValue(singleValue, extraInfo));
		}
	}

	setVariable(variable) {
		this.variable = variable;
	}
};