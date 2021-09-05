import { AlphaColorType } from '../../../../parsing/data-types/AlphaColorType.js';
import { isInstructionList } from '../../../../parsing/parse-tree-analysis/isInstructionList.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';

/*
This is mainly for cases where code is pasted from:
https://www.transum.org/software/Logo/

Code for that often uses "pc" instead of "setPenColor".
*/
function isNextPossiblyAParameter(pcCall) {
	const next = pcCall.nextSibling;
	if (next === null || !AlphaColorType.isDefinitelyCompatibleWith(next))
		return false;
	return true;
}

export function pcFixer(cachedParseTree, fixLogger) {
	const pcCalls = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(token => token.val.toLowerCase() === 'pc' && isInstructionList(token.parentNode));
	if (pcCalls.length === 0)
		return; // nothing to do.

	pcCalls.forEach(function(pcCall) {
		if (!isNextPossiblyAParameter(pcCall))
			return;
		const oldVal = pcCall.val;
		pcCall.val = 'setPenColor';
		const next = pcCall.nextSibling;
		next.remove();
		pcCall.appendChild(next);

		cachedParseTree.tokenValueChanged(pcCall, oldVal);
		fixLogger.log(`Replaced pc with setPenColor because setPenColor is the command to set pen color in WebLogo.`, pcCall);
	});
};