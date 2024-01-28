import { ArrayUtils } from '../../../ArrayUtils.js';

/*
Only the error with the least line number should be shown.

One of this type of procedure often leads to every following procedure having the same message which can be misleading.
The first message is the one closest to the source of the problem.
*/
function isOfInterest(msg) {
	return msg.msg.startsWith('Unexpected end to procedure');
}

export function unexpectedEndToProcedureDenoiser(cachedParseTree, parseMessages) {
	const ofInterestMessages = parseMessages.filter(isOfInterest);
	if (ofInterestMessages.length !== 0) {
		const firstLine = Math.min(...ofInterestMessages.map(msg => msg.token.lineIndex));
		ArrayUtils.remove(parseMessages, m => !isOfInterest(m) || m.token.lineIndex === firstLine);
	}
};
