import { Command } from '../../Command.js';
import { isMutationCommand } from './isMutationCommand.js';
import { ParseTreeToken } from '../../ParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const primaryNameToChildIndex = new Map([
	['do.while', 0],
	['for', 1],
	['forever', 0],
	['repeat', 1], 
	// number of repeats expression is child 0.  It is never calculated again.
	['until', 0],
	['while', 0],
]);
const ifNames = new Set(['if', 'ifelse']);
const topTypes = new Set([ParseTreeTokenType.PROCEDURE_START_KEYWORD,
ParseTreeTokenType.TREE_ROOT]);

function structureCallToLastSingleValueToken(callToken, originalToken) {
	const info = Command.getCommandInfo(callToken.val);
	if (info === undefined) // assume it is a procedure call.
		return callToken;
	if (ifNames.has(info.primaryName)) // never repeats so the result should be the original token.
		return originalToken;
	const childIndex = primaryNameToChildIndex.get(info.primaryName);
	if (childIndex === 0)
		return callToken;
	if (childIndex !== undefined && callToken.children.length > childIndex)
		return callToken.children[childIndex];
	return callToken;
}

export function getLastSingleValueTokenForControlStructure(cachedParseTree, variable, scope, procedure, token) {
	const tokenAncestors = new Set();
	let n = token;
	while (n !== null) {
		tokenAncestors.add(n);
		n = n.parentNode;
	}
	let startToken = scope.assignToken;
	// if this is a procedure parameter, start with the first node in the instruction list.
	if (topTypes.has(startToken.parentNode.type) && startToken.children.length !== 0)
		startToken = ParseTreeToken.getFirstDescendentTokenOf(startToken);
	const sortedTokens = cachedParseTree.getSortedTokens();
	const limit = cachedParseTree.getSortedTokenIndex(ParseTreeToken.getLastDescendentTokenOf(token));
	while (startToken !== null && !topTypes.has(startToken.type)) {
		let i = cachedParseTree.getSortedTokenIndex(startToken);
		for (;
		i <= limit && !tokenAncestors.has(sortedTokens[i]) &&
		!tokenAncestors.has(sortedTokens[i]);
		i++);
		n = sortedTokens[i];
		if (token === n)
			return token;
		if (n.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			if (isMutationCommand(n.val))
				return ParseTreeToken.getLastDescendentTokenOf(n);
			return structureCallToLastSingleValueToken(n, token);
		}
		startToken = startToken.parentNode;
	}
	return n;
};