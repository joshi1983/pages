import { Command } from '../../../../parsing/Command.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
await Command.asyncInit();

export function booleanExpressionAsListFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LIST).filter(function(token) {
		if (token.parentNode === null || token.children.length !== 3)
			return false;
		if (token.parentNode.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
			return false;
		const info = Command.getCommandInfo(token.parentNode.val);
		if (info === undefined)
			return false;
		const childIndex = token.parentNode.children.indexOf(token);
		const argTypes = Command.getParameterTypes(info, childIndex);
		return argTypes === 'bool';
	});
	tokens.forEach(function(token) {
		token.children.forEach(function(childToken) {
			if (childToken.type === ParseTreeTokenType.LEAF && (childToken.val === '[' || childToken.val === ']')) {
				token.removeChild(childToken);
				cachedParseTree.tokenRemoved(childToken);
			}
		});
		const child = token.children[0];
		const parent = token.parentNode;
		parent.replaceChild(token, child);
		cachedParseTree.tokenRemoved(token);
		fixLogger.log(`Removed [square brackets] around a boolean expression in a ${parent.val} command input`, child);
	});
}