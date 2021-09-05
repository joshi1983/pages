import { isMutationCommand } from
'../../../../parse-tree-analysis/variable-data-types/isMutationCommand.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
import { SetUtils } from
'../../../../../SetUtils.js';

export function isLikelyVariableReference(stringLiteralToken) {
	const parent = stringLiteralToken.parentNode;
	if (parent.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;

	return isMutationCommand(parent.val);
};

export function getTakenVariableNames(cachedParseTree) {
	const variableReads = cachedParseTree.getTokensByType(ParseTreeTokenType.VARIABLE_READ);
	const variableReferences = cachedParseTree.getTokensByTypes([
		ParseTreeTokenType.LONG_STRING_LITERAL,
		ParseTreeTokenType.STRING_LITERAL
	]).filter(isLikelyVariableReference);
	const result = new Set(variableReads.map(r => r.val.toLowerCase()));
	SetUtils.addAll(result, variableReferences.map(r => r.val.toLowerCase()));
	return result;
};