import { WrappedFixLogger } from './WrappedFixLogger.js';

/*
// this code is commented out for now but could be useful if a bug related to
// a fixer corrupting the parse tree data structure happens again.
function isTreeCorrupted(cachedParseTree) {
	const tokens = cachedParseTree.getAllTokens();
	for (const token of tokens) {
		if (token.nextSibling === token)
			return true;
		if (token.previousSibling === token)
			return true;
		for (const child of token.children) {
			if (child.parentNode !== token)
				return true;
		}
	}
	return false;
}*/

export function runAllFixers(allFixers) {
	return function(cachedParseTree, fixLogger) {
		for (const fixer of allFixers) {
			const wFixLogger = new WrappedFixLogger(fixLogger);
			fixer(cachedParseTree, wFixLogger);
			/*if (isTreeCorrupted(cachedParseTree)) {
				throw new Error(`Tree corrupted after running ${fixer.name}`);
			}*/
		}
	}
};