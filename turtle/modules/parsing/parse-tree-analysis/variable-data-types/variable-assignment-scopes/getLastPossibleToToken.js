import { Command } from
'../../../Command.js';
import { CommandCalls } from '../../CommandCalls.js';
import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getLastDescendentTokenOf } from
'../../../generic-parsing-utilities/getLastDescendentTokenOf.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

function isBreakCall(token) {
	return CommandCalls.tokenMatchesPrimaryName(token, 'break');
}

function isMainProcedureInstructionList(token) {
	return token.type === ParseTreeTokenType.LIST &&
		token.parentNode !== null &&
		token.parentNode.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD &&
		token.parentNode.children.indexOf(token) === 3;
}

function getLastPossibleToTokenFrom(varName, token) {
	if (token.type === ParseTreeTokenType.PROCEDURE_END_KEYWORD &&
	token.val.toLowerCase() === 'end')
		return token;
	if (isMainProcedureInstructionList(token)) {
		if (token.nextSibling === null)
			return getLastDescendentTokenOf(token);
		return token.nextSibling;
	}
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.val);
		if (info !== undefined) {
			if (info.primaryName === 'make' || info.primaryName === 'localmake') {
				const firstChild = token.children[0];
				if (firstChild !== undefined && firstChild.isStringLiteral() &&
				firstChild.val.toLowerCase() === varName)
					return token;
			}
		}
	}
	let next = token;
	while (next.nextSibling === null) {
		if (isMainProcedureInstructionList(next))
			break;
		if (next.parentNode === null)
			return getLastDescendentTokenOf(next);
		else
			next = next.parentNode;
	}
	if (next.nextSibling !== null)
		next = next.nextSibling;
	if (next === token)
		return token;
	return getLastPossibleToTokenFrom(varName, next);
}

export function getLastPossibleToToken(scope) {
	let result = scope.toToken;
	const assignToken = scope.assignToken;
	let token = result;
	while (token.parentNode !== null) {
		if (token.parentNode === assignToken.parentNode) {
			// if a break is found, return token.nextSibling.
			if (token.nextSibling !== null &&
			getDescendentsOfType(token, ParseTreeTokenType.PARAMETERIZED_GROUP).some(isBreakCall))
				return getLastPossibleToTokenFrom(scope.variable.name, token.nextSibling);
			break;
		}
		token = token.parentNode;
	}
	return result;
};