import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

function isLikelyGoto(token) {
	if (token.val.toLowerCase() !== 'goto')
		return false;

	const next = token.nextSibling; // next should represent the colon after the label.
	if (next === null || next.type !== ParseTreeTokenType.LEAF)
		return false;
	return true;
}

function isOfInterest(cachedParseTree) {
	const gotos = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).filter(isLikelyGoto);
	const referencedNames = new Set(gotos.map(t => t.nextSibling.val.toLowerCase()));

	return function(token) {
		const colonToken = token.nextSibling;
		if (colonToken === null ||
		colonToken.type !== ParseTreeTokenType.VARIABLE_READ ||
		colonToken.val !== '')
			return false;

		return !referencedNames.has(token.val.toLowerCase());
	};
}

export function removeUnreferencedLabelsFixer(cachedParseTree, fixLogger) {
	const labels = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).filter(isOfInterest(cachedParseTree));
	labels.forEach(function(labelToken) {
		const colonToken = labelToken.nextSibling;
		labelToken.remove();
		colonToken.remove();
		cachedParseTree.tokensRemoved([labelToken, colonToken]);
		fixLogger.log(`Removed reference to label ${labelToken.val} because WebLogo does not support labels and goto statements.`, labelToken);
			// The real reason here is different from that text.  The text should be more clear to end users in a broad number of cases, though.
			
			// The specific reason here is actually that the label was not referenced 
			// and would therefore have no purpose even if goto statements were supported.
			//
			// The text explains something more broadly about WebLogo anyway because that should be more helpful in most cases this fixer is used.
			// Another fixer like gotoToForeverFixer may have removed goto statements from the parse tree making this one unfereferenced.
			// If the end-user pasted code like "x: goto x" in the code editor, saying "x" was 
			// removed because it was unreferenced would be more confusing than saying what is above.
	});
	return labels.length !== 0;
};