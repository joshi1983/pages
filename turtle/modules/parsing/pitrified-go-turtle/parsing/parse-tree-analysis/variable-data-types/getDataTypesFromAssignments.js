import { evaluateDataTypesForToken } from
'./evaluateDataTypesForToken.js';
import { getClosestOfType } from
'../../../../generic-parsing-utilities/getClosestOfType.js';
import { getInScopeDeclaration } from
'./getInScopeDeclaration.js';
import { isPossibleVariableRead } from
'./isPossibleVariableRead.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

function isConstantAssignmentOfInterest(token, tokenTypesMap) {
	const parent = token.parentNode;
	if (parent.val !== '=')
		return false;
	const closestConst = getClosestOfType(parent, ParseTreeTokenType.CONST);
	if (closestConst === null)
		return false;

	const children = parent.children;
	if (children.length !== 2)
		return false;
	
	const rightTypes = tokenTypesMap.get(children[1]);
	return rightTypes !== undefined;
}

function isVariableAssignmentOfInterest(token, tokenTypesMap) {
	if (isConstantAssignmentOfInterest(token, tokenTypesMap))
		return true;
	const parent = token.parentNode;
	const children = parent.children;
	if (parent.type !== ParseTreeTokenType.ASSIGNMENT_OPERATOR ||
	children.length !== 2 ||
	children.indexOf(token) !== 0)
		return false;
	if (parent.val !== ':=')
		return false;
	return true;
}

function variableAssignmentToTypesString(token, map, settings) {
	const rightOperandToken = token.parentNode.children[1];
	if (rightOperandToken !== undefined) {
		const types = evaluateDataTypesForToken(rightOperandToken, map, settings);
		return types;
	}
}

export function getDataTypesFromAssignments(tokens, result, settings) {
	if (tokens instanceof Set)
		tokens = Array.from(tokens);
	const identifiers = tokens.filter(t => t.type === ParseTreeTokenType.IDENTIFIER);
	const varReads = tokens.filter(i => isPossibleVariableRead(i) && !isVariableAssignmentOfInterest(i, result));
	const declarations = identifiers.filter(i => isVariableAssignmentOfInterest(i, result));
	const declarationNameMap = new Map();
	for (const dec of declarations) {
		let decs = declarationNameMap.get(dec.val);
		if (decs === undefined) {
			decs = [];
			declarationNameMap.set(dec.val, decs);
		}
		decs.push(dec);
	}
	for (const identifier of varReads) {
		const decs = declarationNameMap.get(identifier.val);
		if (decs !== undefined) {
			const dec = getInScopeDeclaration(identifier, decs);
			if (dec !== undefined) {
				const types = variableAssignmentToTypesString(dec, result, settings);
				result.set(identifier, types);
			}
		}
	}
};