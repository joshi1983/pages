import { Command } from '../../Command.js';
import { isInstructionList } from '../isInstructionList.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
await Command.asyncInit();

function mightNotExecute(token) {
	if (token.parentNode === null)
		return false;
	if (token.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD)
		return false;
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.val);
		if (info !== undefined) {
			if (info.primaryName === 'if' || info.primaryName === 'ifelse')
				return true;
		}
	}
	return mightNotExecute(token.parentNode);
}

function getNearestInstructionList(token) {
	while (token !== null && !isInstructionList(token))
		token = token.parentNode;
	return token;
}

function isDirectlyInSameInstructionList(assignToken, newToToken) {
	let token = assignToken;
	const ilNewToToken = getNearestInstructionList(newToToken);
	while (token !== null) {
		if (token === ilNewToToken)
			return true;
		token = token.parentNode;
	}
	return false;
}

/*
shouldScopeBeReduced decides if a variable scope should have its toToken set to newToToken.
This decision is based on a couple factors:
- Is the new token guaranteed to execute if the current scope is applicable?  
If no, return false because the current scope may continue to be applicable.
*/
export function shouldScopeBeReduced(cachedParseTree, variableScope, newToToken) {
	if (isDirectlyInSameInstructionList(variableScope.assignToken, newToToken))
		return true;
	if (mightNotExecute(newToToken))
		return false;
	return true;
};