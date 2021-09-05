import { getClosestOfType } from
'../../../../../generic-parsing-utilities/getClosestOfType.js';
import { getContainingFunction } from
'../getContainingFunction.js';
import { getSortedLastTokenFromArray } from
'../../../../../generic-parsing-utilities/getSortedLastTokenFromArray.js';
import { isAfterOrSame } from
'../../../../../generic-parsing-utilities/isAfterOrSame.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

function tieBreakCompare(token1, token2) {
	return 0;
}

function isInDim(token) {
	return getClosestOfType(token, ParseTreeTokenType.DIM) !== null;
}

export class Variable {
	constructor(name) {
		if (typeof name !== 'string')
			throw new Error(`name must be a string but found ${name}`);

		this.name = name;
		this.declarations = [];
		this.assignments = [];
	}

	// assignmentToken should be a ParseTreeToken with 
	// type = ParseTreeTokenType.ASSIGNMENT.
	addAssignment(assignmentToken) {
		this.assignments.push(assignmentToken);
	}

	// identifierToken should be a ParseTreeToken with 
	// type = ParseTreeTokenType.IDENTIFIER and
	// identifierToken.val.toLowerCase() === this.name
	addDeclaration(identifierToken) {
		this.declarations.push(identifierToken);
	}

	// called to help free memory when a Variable is no longer needed.
	dispose() {
		this.assignments = undefined;
		this.declarations = undefined;
		this.name = undefined;
	}

	getDeclarationAt(token) {
		const functionToken = getContainingFunction(token);
		let declarations = this.declarations.filter(t => t !== token);
		if (functionToken !== null)
			declarations = declarations.filter(t => getContainingFunction(t) === functionToken);
		else
			declarations = declarations.filter(t => isAfterOrSame(token, t) &&
				getContainingFunction(t) === null);
		if (declarations.length > 1) {
			const last = getSortedLastTokenFromArray(declarations, tieBreakCompare);
			return last;
		}
		if (declarations.length === 1)
			return declarations[0];
	}

	isArrayAt(token) {
		const declaration = this.getDeclarationAt(token);
		if (declaration === undefined)
			return false;

		return isInDim(declaration);
	}
};