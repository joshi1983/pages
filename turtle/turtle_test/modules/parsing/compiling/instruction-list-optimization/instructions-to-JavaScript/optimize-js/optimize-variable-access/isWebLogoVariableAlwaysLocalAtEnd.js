import { getVariableReadRootToken } from './getVariableReadRootToken.js';
import { getVariableWriteRootToken } from './getVariableWriteRootToken.js';
import { isDefinitelyExecuted } from './isDefinitelyExecuted.js';
import { isLocalmakeAssignment } from '../token-classifiers/isLocalmakeAssignment.js';
import { isLocalVariableRead } from '../token-classifiers/isLocalVariableRead.js';
import { isLocalVariablesSetCall } from '../token-classifiers/isLocalVariablesSetCall.js';
import { isWebLogoVariableAlwaysLocal } from './isWebLogoVariableAlwaysLocal.js';
import { MaybeDecided } from '../../../../../../MaybeDecided.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

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