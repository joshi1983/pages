import { getClosestOfType } from
'../../../../../../generic-parsing-utilities/getClosestOfType.js';
import { getContainingFunction } from
'../getContainingFunction.js';
import { getSortedLastTokenFromArray } from
'../../../../../../generic-parsing-utilities/getSortedLastTokenFromArray.js';
import { isAfterOrSame } from
'../../../../../../generic-parsing-utilities/isAfterOrSame.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

function tieBreakCompare(token1, token2) {
	return 0;
}

function isInDim(token) {
	return getClosestOfType(token, ParseTreeTokenType.DIM) !== null;
}

function getBestMatch(tokens, token) {
	const functionToken = getContainingFunction(token);
	tokens = tokens.filter(t => t !== token);
	if (functionToken === null)
		tokens = tokens.filter(t => isAfterOrSame(token, t) &&
			getContainingFunction(t) === null);
	else
		tokens = tokens.filter(t => getContainingFunction(t) === functionToken);
	if (tokens.length > 1) {
		const last = getSortedLastTokenFromArray(tokens, tieBreakCompare);
		return last;
	}
	if (tokens.length === 1)
		return tokens[0];
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
	// it could also be a = BINARY_OPERATOR but only if it is in the initialization of a for-loop.
	addAssignment(assignmentToken) {
		this.assignments.push(assignmentToken);
	}

	// identifierToken should be a ParseTreeToken with 
	// type = ParseTreeTokenType.IDENTIFIER and
	// identifierToken.val.toLowerCase() === this.name
	//
	// Another option is the token could be a
	// type = ParseTreeTokenType.BINARY_OPERATOR with val -
	// in a DEF_PRIMITIVE.  This would correspond with a variable name range.
	addDeclaration(token) {
		this.declarations.push(token);
	}

	// called to help free memory when a Variable is no longer needed.
	dispose() {
		this.assignments = undefined;
		this.declarations = undefined;
		this.name = undefined;
	}

	getAssignmentBefore(token) {
		return getBestMatch(this.assignments, token);
	}

	getDeclarationAt(token) {
		return getBestMatch(this.declarations, token);
	}

	isArrayAt(token) {
		const declaration = this.getDeclarationAt(token);
		if (declaration === undefined)
			return false;

		if (isInDim(declaration)) {
			const next = declaration.getNextSibling();
			if (next !== null && next.type === ParseTreeTokenType.AS)
				return false;
			return true;
		}
		return false;
	}
};