import { forTokenToInitVariableName } from './forTokenToInitVariableName.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

function isAssignedTo(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	parent.children.indexOf(token) === 0)
		return true;
	return false;
}

function getVariableReadsOfConcernForRepeatInSet(token, variableName, result) {
	if (token.type === ParseTreeTokenType.IDENTIFIER &&
	token.children.length === 0 &&
	token.val === variableName) {
		if (isAssignedTo(token))
			return;
		const parent = token.parentNode;
		if (parent.type !== ParseTreeTokenType.DOT &&
		parent.type !== ParseTreeTokenType.METHOD_CALL) {
			result.add(token);
		}
		return;
	}
	else if (token.type === ParseTreeTokenType.FOR) {
		const initVariableName = forTokenToInitVariableName(token);
		if (initVariableName === variableName)
			return;
			// don't need to get into a for-loop that declares its own local scoped variable with the same name.
	}
	for (const child of token.children) {
		getVariableReadsOfConcernForRepeatInSet(child, variableName, result);
	}
}

export function getVariableReadsOfConcernForRepeat(codeBlockToken, variableName) {
	if (typeof variableName !== 'string')
		throw new Error(`variableName must be a string but found ${variableName}`);

	const result = new Set();
	getVariableReadsOfConcernForRepeatInSet(codeBlockToken, variableName, result);
	return result;
};