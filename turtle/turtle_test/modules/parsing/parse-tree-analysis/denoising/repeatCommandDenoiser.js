import { ArrayUtils } from '../../../ArrayUtils.js';

function isRepeatCommandMessage(msg) {
	return msg.msg.indexOf('must not be called outside of a repeat') !== -1;
}

function isRemovable(msg) {
	msg = msg.msg;
	return msg.indexOf('does not do anything useful') !== -1;
}

export function repeatCommandDenoiser(cachedParseTree, parseMessages) {
	const repeatMessages = parseMessages.filter(isRepeatCommandMessage);
	const tokensAffected = new Set();
	repeatMessages.forEach(function(message) {
		let token = message.token;
		tokensAffected.add(token);
	});
	ArrayUtils.remove(parseMessages, m => !tokensAffected.has(m.token) || !isRemovable(m));
};