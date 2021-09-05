import { ArrayUtils } from '../../../ArrayUtils.js';

function isCurvedBracketMessage(msg) {
	return msg.msg.indexOf('The curved brackets must be balanced') !== -1;
}

function isRemovable(msg) {
	if (msg.msg.indexOf('curved bracket') !== -1)
		return false;
	return !isCurvedBracketMessage(msg);
}

export function curvedBracketDenoiser(cachedParseTree, parseMessages) {
	const curvedBracketMessages = parseMessages.filter(isCurvedBracketMessage);
	if (curvedBracketMessages.length === 0)
		return;

	ArrayUtils.remove(parseMessages, m => !isRemovable(m));
};