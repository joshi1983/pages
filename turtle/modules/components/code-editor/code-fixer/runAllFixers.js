import { LogoParser } from
'../../../parsing/LogoParser.js';
import { parseTreeToCodeWithComments } from
'../../../parsing/parseTreeToCodeWithComments.js';
import { ParseLogger } from
'../../../parsing/loggers/ParseLogger.js';

// this code is commented out for now but could be useful if a bug related to
// a fixer corrupting the parse tree data structure happens again.
function isTreeCorrupted(cachedParseTree, name) {
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
	const originalCode = `to Circle0 :x :y
	forward 100
end

Circle0 550 -290`;
	const code = parseTreeToCodeWithComments(cachedParseTree.root, originalCode);
	console.log(`name=${name}, code=${code}`);
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(code, parseLogger);
	if (tree === undefined || parseLogger.hasLoggedErrors())
		return true;
	
	//const minusTokens = tokens.filter(t => t.val === '-' && t.type === ParseTreeTokenType.BINARY_OPERATOR);
	//if (minusTokens.length !== 0)
	//	return true;
	
	return false;
}

export function runAllFixers(allFixers) {
	return function(cachedParseTree, fixLogger) {
		for (const fixer of allFixers) {
			fixer(cachedParseTree, fixLogger);
			if (isTreeCorrupted(cachedParseTree, fixer.name)) {
				throw new Error(`Tree corrupted after running ${fixer.name}`);
			}
		}
	}
};