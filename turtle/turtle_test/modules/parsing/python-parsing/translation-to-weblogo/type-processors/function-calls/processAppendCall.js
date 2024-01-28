import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { isMethodCallToken } from '../../../parse-tree-analysis/isMethodCallToken.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { printChildren } from '../helpers/printChildren.js';

export function isListAppendMethodCall(token) {
	if (!isMethodCallToken(token))
		return false;
	const grandParent = token.parentNode.parentNode;
	if (grandParent === null || grandParent.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	const parameterValueTokens = filterBracketsAndCommas(token.children);
	if (parameterValueTokens.length !== 1)
		return false;
	return true;
};

export function processAppendCall(token, result, cachedParseTree) {
	if (!isListAppendMethodCall(token))
		return;
	const grandParent = token.parentNode.parentNode;
	const parameterValueTokens = filterBracketsAndCommas(token.children);
	result.append(`\nqueue2 "${grandParent.val} `);
	printChildren(token, result, cachedParseTree);
	result.append('\n');
};