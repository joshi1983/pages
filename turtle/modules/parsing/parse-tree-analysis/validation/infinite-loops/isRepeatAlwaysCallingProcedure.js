import { isInstructionListAlwaysCallingProc } from './isInstructionListAlwaysCallingProc.js';

export function isRepeatAlwaysCallingProcedure(procName, repeatToken, cachedParseTree) {
	if (repeatToken.children.length !== 2)
		return false;
	const tokenValues = cachedParseTree.getTokenValues();
	const maxRepeatCount = tokenValues.get(repeatToken.children[0]);
	if (maxRepeatCount === undefined || maxRepeatCount < 1)
		return false;
		// we can't prove that this causes an infinite loop if we don't know that even 1 iteration will happen.

	return isInstructionListAlwaysCallingProc(procName, repeatToken.children[1], cachedParseTree);
};