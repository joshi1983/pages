import { isInstructionListAlwaysCallingProc } from './isInstructionListAlwaysCallingProc.js';

export function validateForInfiniteRecursion(cachedParseTree, parseLogger) {
	const procedures = cachedParseTree.getProceduresStrictlyFromTree();
	procedures.forEach(function(proc) {
		const startToken = proc.getStartToken();
		if (startToken.children.length > 2 &&
		isInstructionListAlwaysCallingProc(proc.name.toLowerCase(), startToken.children[2], cachedParseTree))
			parseLogger.warn('The ' + proc.name + ' procedure endlessly calls itself creating an infinite loop', startToken);
	});
};