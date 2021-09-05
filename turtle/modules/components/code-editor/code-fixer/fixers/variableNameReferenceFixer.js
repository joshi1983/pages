import { Command } from '../../../../parsing/Command.js';
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
			if (info.primaryName === 'swap')
				return true;

			const index = token.parentNode.children.indexOf(token);
			const paramTypes = Command.getParameterTypes(info, index);
			if (paramTypes !== 'string')
				return false;
			if (info.primaryName === 'make' || info.primaryName === 'localmake')
				return true;
			const argInfo = info.args[index];
			if (argInfo === undefined)
				return false;
			return argInfo.refTypes !== undefined;
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