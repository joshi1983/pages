import { flatten } from '../../../../../generic-parsing-utilities/flatten.js';
import { getAllDescendentsAsArray } from '../../../../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { isGlobalVariablesSetCall } from '../token-classifiers/isGlobalVariablesSetCall.js';
import { isLocalmakeCall } from '../token-classifiers/isLocalmakeCall.js';
import { isLocalVariablesSetCall } from '../token-classifiers/isLocalVariablesSetCall.js';
import { parse } from '../../../../../js-parsing/parse.js';
import { parseTreeTokensToCode } from '../../../../../js-parsing/parseTreeTokensToCode.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';
import { removeSemicolonsImmediatelyAfter } from '../removeSemicolonsImmediatelyAfter.js';

function isSafeToRemove(token) {
	if (isLocalVariablesSetCall(token) ||
	isLocalmakeCall(token))
		return true;
	return false;
}

function isTokenUnsafeToSkip(token) {
	if (isGlobalVariablesSetCall(token))
		return true;
	return false;
}

function canNotBeSkipped(token) {
	if (token.type === ParseTreeTokenType.CODE_BLOCK) {
		const tokens = getAllDescendentsAsArray(token);
		return tokens.some(isTokenUnsafeToSkip);
	}
	return true;
}

export function removeTrailingLocalSetCalls(jsCode) {
	// avoid parsing if it is easily shown unnecessary.
	if (jsCode.indexOf('localmake') === -1 && (
	jsCode.indexOf('localVariables') === -1 ||
	jsCode.indexOf('set') === -1))
		return jsCode;
	const parseResult = parse(jsCode);
	const children = parseResult.root.children;
	for (let i = children.length - 1; i >= 0; i--) {
		const child = children[i];
		if (child.type !== ParseTreeTokenType.SEMICOLON) {
			if (isSafeToRemove(child)) {
				removeSemicolonsImmediatelyAfter(child);
				child.remove();
			}
			else if (canNotBeSkipped(child))
				break;
		}
	}
	return parseTreeTokensToCode(flatten(parseResult.root));
};