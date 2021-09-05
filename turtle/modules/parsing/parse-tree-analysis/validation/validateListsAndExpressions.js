import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function validateListsAndExpressions(cachedParseTree, parseLogger) {
	const tokens = cachedParseTree.getAllTokens().filter(function(token) {
		if ((token.type !== ParseTreeTokenType.LIST &&
		token.type !== ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) ||
		token.children.length === 0)
			return false;
		return true;
	});
	tokens.forEach(function(token) {
		const firstBracket = token.children[0];
		const lastBracket = token.children[token.children.length - 1];
		if (token.type === ParseTreeTokenType.LIST) {
			if ((firstBracket.val === '[') !== (lastBracket.val === ']'))
				parseLogger.error('The square brackets for a list must be balanced', token);
		}
		else {
			if ((firstBracket.val === '(') !== (lastBracket.val === ')'))
				parseLogger.error('The curved brackets must be balanced', token);
		}
	});
};