import { isInstructionListAlwaysCallingProc } from './isInstructionListAlwaysCallingProc.js';

export function isIfElseAlwaysCallingProcedure(procName, ifElseToken, cachedParseTree) {
	const children = ifElseToken.children;
	if (children.length !== 3) // if invalid number of children
		return false;

	return isInstructionListAlwaysCallingProc(procName, children[1], cachedParseTree) &&
		isInstructionListAlwaysCallingProc(procName, children[2], cachedParseTree);
};