import { Command } from '../../../../parsing/Command.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { validateIdentifier } from '../../../../parsing/parse-tree-analysis/validateIdentifier.js';
await Command.asyncInit();

export function variableNameReferenceFixer(cachedParseTree, fixLogger) {
	const varReadTokens = cachedParseTree.getTokensByTypes([
	ParseTreeTokenType.VARIABLE_READ, ParseTreeTokenType.LEAF]).filter(function(token) {
		if (token.parentNode === null)
			return false;
		if (token.parentNode.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
			validateIdentifier(token.val) === undefined) {
			const info = Command.getCommandInfo(token.parentNode.val);
			if (info === undefined)
				return false;

			const index = token.parentNode.children.indexOf(token);
			const paramTypes = Command.getParameterTypes(info, index);
			return paramTypes === 'string' && (
				info.args[index].refTypes !== undefined ||
				['localmake', 'make'].indexOf(info.primaryName) !== -1
			);
		}
		return false;
	});
	varReadTokens.forEach(function(varReadToken) {
		const previousType = varReadToken.type;
		varReadToken.type = ParseTreeTokenType.STRING_LITERAL;
		cachedParseTree.tokenTypeChanged(varReadToken, previousType);
		fixLogger.log(`Added a quote(") mark before ${varReadToken.val} because a variable name was required`, varReadToken);
	});
};