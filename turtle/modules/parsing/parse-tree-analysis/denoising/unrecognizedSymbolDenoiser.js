import { ArrayUtils } from '../../../ArrayUtils.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function isUnrecognizedMessage(msg) {
	return msg.msg.startsWith('Unrecognized symbol(');
}

function isRemovable(msg) {
	msg = msg.msg;
	return msg.indexOf(' is not a recognized command or procedure name') !== -1;
}

export function unrecognizedSymbolDenoiser(cachedParseTree, parseMessages) {
	const unrecognizedMessages = parseMessages.filter(isUnrecognizedMessage);
	const tokensAffected = new Set();
	unrecognizedMessages.forEach(function(message) {
		let token = message.token;
		while (token !== null && token.type === ParseTreeTokenType.LEAF) {
			tokensAffected.add(token);
			token = token.nextSibling;
		}
	});
	ArrayUtils.remove(parseMessages, m => !tokensAffected.has(m.token) || !isRemovable(m));

};