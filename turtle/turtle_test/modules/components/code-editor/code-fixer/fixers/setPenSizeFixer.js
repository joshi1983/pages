/*
Some other Logo interpreters like FMS Logo have a setpensize command that takes a list of 2 numbers but they actually use one of the 2 numbers.
They planned to make each number independently meaningful but that hasn't happened yet so WebLogo is taking a single number instead.

This fixer helps migrate code from these other interpreters for use in WebLogo.
*/
import { CommandCalls } from '../../../../parsing/parse-tree-analysis/CommandCalls.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
await ParseTreeToken.asyncInit();

export function setPenSizeFixer(cachedParseTree, fixLogger) {
	const erroneousSetPenSizeCalls = CommandCalls.filterCommandCalls(
		cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP), 
	'setPenSize').filter(function(token) {
		if (token.children.length !== 1)
			return false;
		const child = token.children[0];
		if (child.type !== ParseTreeTokenType.LIST)
			return false;
		if (child.children.length !== 4) // We're looking for things like [2 2] so 4 tokens.
			return false;
		if (child.children[0].val !== '[' || child.children[3].val !== ']')
			return false;
		return true;
	});
	erroneousSetPenSizeCalls.forEach(function(token) {
		const listChildToken = token.children[0];
		const grandChildToUse = listChildToken.children[1];
		token.replaceChild(listChildToken, grandChildToUse);
		cachedParseTree.tokenRemoved(listChildToken);
		for (let i = 0; i < listChildToken.children.length; i++) {
			const gToken = listChildToken.children[i];
			if (gToken !== grandChildToUse)
				cachedParseTree.tokenRemoved(gToken);
		}
		fixLogger.log('In a call to setPenSize, a list input was replaced with its first element', token);
	});
};