import { forTokenToInitVariableName } from './forTokenToInitVariableName.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

function getVariableReadsOfConcernForRepeatInSet(token, variableName, result) {
	if (token.type === ParseTreeTokenType.IDENTIFIER &&
	token.children.length === 0 &&
	token.val === variableName) {
		result.add(token);
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
};

export function getVariableReadsOfConcernForRepeat(codeBlockToken, variableName) {
	if (typeof variableName !== 'string')
		throw new Error(`variableName must be a string but found ${variableName}`);

	const result = new Set();
	getVariableReadsOfConcernForRepeatInSet(codeBlockToken, variableName, result);
	return result;
};