import { declaringTypes } from './declaringTypes.js';
import { getVariableReadRootToken } from './getVariableReadRootToken.js';
import { getVariableWriteRootToken } from './getVariableWriteRootToken.js';
import { isLocalmakeAssignment } from '../token-classifiers/isLocalmakeAssignment.js';
import { isLocalVariableRead } from '../token-classifiers/isLocalVariableRead.js';
import { isLocalVariablesSetCall } from '../token-classifiers/isLocalVariablesSetCall.js';
import { isWebLogoVariableAlwaysLocal } from './isWebLogoVariableAlwaysLocal.js';
import { MaybeDecided } from '../../../../../../MaybeDecided.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';
import { SetUtils } from '../../../../../../SetUtils.js';

const continueTypes = new Set([
ParseTreeTokenType.ARG_LIST,
ParseTreeTokenType.ASSIGNMENT_OPERATOR,
ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
ParseTreeTokenType.FUNCTION_CALL,
ParseTreeTokenType.UNARY_OPERATOR
]);
SetUtils.addAll(continueTypes, declaringTypes);

function isDefinitelyExecuted(token) {
	for (token = token.parentNode;token !== null;token = token.parentNode) {
		if (token.type === ParseTreeTokenType.CODE_BLOCK) {
			if (token.parentNode.type === ParseTreeTokenType.IF)
				return false;
			continue;
		}
		if (continueTypes.has(token.type))
			continue;
		if (token.type === ParseTreeTokenType.TREE_ROOT)
			return true;
		if (token.parentNode.type === ParseTreeTokenType.BINARY_OPERATOR) {
			const parent = token.parentNode;
			if (parent.children.indexOf(token) === 0)
				continue;
			if (parent.val === '&&' || parent.val === '||') {
				// The right side operand may not be evaluated for expressions involving && and ||.
				return false;
			}
			continue;
		}
		return false;
	}
	return true;
}

function isReadTokenLocal(token) {
	if (token.type === ParseTreeTokenType.IDENTIFIER)
		return false;
	const stringLiteralToken = token;
	const readRootToken = getVariableReadRootToken(stringLiteralToken);
	if (!isDefinitelyExecuted(readRootToken))
		return false;
	if (isLocalVariableRead(stringLiteralToken))
		return true;
	return false;
}

function isMakeTokenLocal(token) {
	const root = getVariableWriteRootToken(token);
	if (!isLocalmakeAssignment(token) && !isLocalVariablesSetCall(root)) {
		return false;
	}
	if (!isDefinitelyExecuted(root))
		return false;
	return true;
}

export function isWebLogoVariableAlwaysLocalAtEnd(info) {
	const alwaysLocalResult = isWebLogoVariableAlwaysLocal(info);
	if (alwaysLocalResult === MaybeDecided.Yes)
		return MaybeDecided.Yes;

	if (info.readTokens.some(isReadTokenLocal))
		return MaybeDecided.Yes;
	if (info.makeTokens.some(isMakeTokenLocal))
		return MaybeDecided.Yes;

	return alwaysLocalResult;
};