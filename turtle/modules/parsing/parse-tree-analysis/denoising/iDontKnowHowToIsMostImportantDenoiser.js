import { ArrayUtils } from '../../../ArrayUtils.js';

function isIDontKnowHowToMessage(msg) {
	msg = msg.msg;
	return msg.indexOf('is not a recognized command or procedure name') !== -1;
}

export function iDontKnowHowToIsMostImportantDenoiser(cachedParseTree, parseMessages) {
	const iDontKnowHowToMessages = parseMessages.filter(isIDontKnowHowToMessage);
	if (iDontKnowHowToMessages.length !== 0) {
		const linesAffected = new Set(iDontKnowHowToMessages.map(m => m.token.lineIndex));
		ArrayUtils.remove(parseMessages, m => !linesAffected.has(m.token.lineIndex) || isIDontKnowHowToMessage(m));
	}
};