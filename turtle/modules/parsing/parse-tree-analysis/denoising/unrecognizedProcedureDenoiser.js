import { Command } from '../../Command.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function isUnrecognizedMessage(msg) {
	return msg.msg.startsWith('Unrecognized command or procedure name');
}

function isRemovable(msg) {
	msg = msg.msg;
	return msg.indexOf('may calculate a value but does not do anything with it') !== -1 ||
		msg.indexOf('A command or procedure should be called here') !== -1 ||
		msg.indexOf('command requires input of type') !== -1 ||
		msg.indexOf('must be of type') !== -1 ||
		msg.indexOf('operator requires input of type') !== -1 ||
		(msg.indexOf('must be of type') !== -1 && msg.indexOf('operand for operator') !== -1);
}

export function unrecognizedProcedureDenoiser(cachedParseTree, parseMessages) {
	const unrecognizedMessages = parseMessages.filter(isUnrecognizedMessage);
	if (unrecognizedMessages.length !== 0) {
		const tokensAffected = new Set();
		unrecognizedMessages.forEach(function(message) {
			let token = message.token;
			while (token !== null && token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP) {
				tokensAffected.add(token);
				token = token.nextSibling;
			}
			token = message.token;
			if (token.previousSibling !== null) {
				token = token.previousSibling;
				if (token.type === ParseTreeTokenType.BINARY_OPERATOR && token.children.length !== 2) {
					tokensAffected.add(token);
				}
				else if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
				token.children.length === 0) {
					const info = Command.getCommandInfo(token.val);
					if (info !== undefined && info.args.length !== 0) {
						tokensAffected.add(token);
					}
				}
			}
		});
		const newMessages = parseMessages.filter(m => !tokensAffected.has(m.token) || !isRemovable(m));
		parseMessages.length = 0;
		parseMessages.push(...newMessages);
	}
};