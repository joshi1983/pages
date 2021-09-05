import { Command } from
'../../../../../parsing/Command.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';
import { validateIdentifier } from
'../../../../../parsing/parse-tree-analysis/validateIdentifier.js';

const otherVariantVariableIndicators = new Set([
	'lmake', 'local'
]);

function isLikelyLocalVariableFromOtherLogoVariant(token) {
	const prev = token.previousSibling;
	if (prev !== null && prev.type === ParseTreeTokenType.LEAF) {
		const lowerCase = prev.val.toLowerCase();
		if (otherVariantVariableIndicators.has(lowerCase))
			return true;
	}
	return false;
}

function isVariableReference(token) {
	if (token.type === ParseTreeTokenType.VARIABLE_READ)
		return true;
	if (validateIdentifier(token.val) !== undefined)
		return false;
	if (isLikelyLocalVariableFromOtherLogoVariant(token))
		return true;
	const parent = token.parentNode;
	if (parent === null || parent.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(parent.val);
	if (info === undefined)
		return false;
	const argInfo = info.args[parent.children.indexOf(token)];
	if (argInfo === undefined || (argInfo.refTypes === undefined &&
	info.primaryName !== 'make' && info.primaryName !== 'localmake'))
		return false;
	return true;
}

export function getAllVariableReferences(wCachedParseTree) {
	const result = wCachedParseTree.getTokensByTypes([
		ParseTreeTokenType.LONG_STRING_LITERAL,
		ParseTreeTokenType.STRING_LITERAL,
		ParseTreeTokenType.VARIABLE_READ,
	]).filter(isVariableReference);
	return result;
};