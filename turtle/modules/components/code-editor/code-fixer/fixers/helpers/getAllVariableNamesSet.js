import { Command } from
'../../../../../parsing/Command.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';
import { validateIdentifier } from
'../../../../../parsing/parse-tree-analysis/validateIdentifier.js';

function isOfInterest(token) {
	if (token.type === ParseTreeTokenType.VARIABLE_READ)
		return true;
	if (validateIdentifier(token.val) !== undefined)
		return false;
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(parent.val);
	if (info === undefined)
		return false;

	const parameterIndex = parent.children.indexOf(token);
	if ((info.primaryName === 'make' || info.primaryName === 'localmake') &&
	parameterIndex === 0)
		return true;
	const paramInfo = Command.getParameterInfo(info, parameterIndex);
	return paramInfo.refTypes !== undefined;
}

export function getAllVariableNamesSet(writableCachedParseTree) {
	const tokens = writableCachedParseTree.getTokensByTypes([
		ParseTreeTokenType.LONG_STRING_LITERAL,
		ParseTreeTokenType.STRING_LITERAL,
		ParseTreeTokenType.VARIABLE_READ
	]).filter(isOfInterest);
	return new Set(tokens.map(t => t.val.toLowerCase()));
};