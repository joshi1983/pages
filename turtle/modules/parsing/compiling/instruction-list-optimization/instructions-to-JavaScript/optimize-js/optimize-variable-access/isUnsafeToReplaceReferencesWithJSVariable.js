import { ArrayUtils } from '../../../../../../ArrayUtils.js';
import { getSortedFirstTokenFromArray } from '../../../../../generic-parsing-utilities/getSortedFirstTokenFromArray.js';
import { isAfterOrSame } from '../../../../../generic-parsing-utilities/isAfterOrSame.js';
import { isContextGlobalVariablesSetCall } from '../token-classifiers/isContextGlobalVariablesSetCall.js';
import { isDefinitelyExecuted } from './isDefinitelyExecuted.js';
import { isGlobalVariablesSetCall } from '../token-classifiers/isGlobalVariablesSetCall.js';
import { isLocalmakeAssignment } from '../token-classifiers/isLocalmakeAssignment.js';
import { isLocalVariablesSetCall } from '../token-classifiers/isLocalVariablesSetCall.js';
import { isMakeAssignment } from '../token-classifiers/isMakeAssignment.js';
import { MaybeDecided } from '../../../../../../MaybeDecided.js';

function mightWriteGlobal(token) {
	if (isMakeAssignment(token))
		return true;
	if (isGlobalVariablesSetCall(token) ||
	isContextGlobalVariablesSetCall(token))
		return true;
	return false;
}

function writesLocal(token) {
	if (isLocalVariablesSetCall(token))
		return true;
	if (isLocalmakeAssignment(token))
		return true;
	return false;
}

export function isUnsafeToReplaceReferencesWithJSVariable(varInfo) {
	if (varInfo.varReferences.length !== 0)
		return true;
	if (varInfo.isAlwaysGlobal === MaybeDecided.Yes ||
	varInfo.isAlwaysLocal === MaybeDecided.Yes)
		return false;
	const allTokens = [];
	ArrayUtils.pushAll(allTokens, varInfo.makeTokens);
	ArrayUtils.pushAll(allTokens, varInfo.setTokens);
	const mightWriteGlobalTokens = allTokens.filter(mightWriteGlobal);
	if (mightWriteGlobalTokens.length === 0)
		return false;
	// find the first token that might be writing a global.
	const firstGlobalWrite = getSortedFirstTokenFromArray(mightWriteGlobalTokens);
	const writeLocalTokens = allTokens.filter(writesLocal);
	if (writeLocalTokens.length === 0)
		return false;
	const firstLocalWrite = getSortedFirstTokenFromArray(writeLocalTokens);
	if (isAfterOrSame(firstLocalWrite, firstGlobalWrite))
		return true;
	const writeLocalTokensDefinitelyExecuted = writeLocalTokens.filter(isDefinitelyExecuted);
	if (writeLocalTokensDefinitelyExecuted.length !== 0) {
		const firstLocalDefinitelyExecutedWrite = getSortedFirstTokenFromArray(writeLocalTokensDefinitelyExecuted);
		if (isAfterOrSame(firstLocalDefinitelyExecutedWrite, firstGlobalWrite))
			return true;
	}
	return false;
};