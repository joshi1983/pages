import { SetUtils } from '../../../SetUtils.js';
import { getInstructionListChildToken } from '../getInstructionListChildToken.js';

function isInvalidVariableNameMessage(msg) {
	return msg.msg.indexOf('Invalid variable name') === 0;
}

function isRemovable(msg) {
	return msg.msg.indexOf('requires input of type') !== -1;
}

/*
If an invalid variable name is used, remove the messages related to required data types.
*/
export function invalidVariableNameDenoiser(cachedParseTree, parseMessages) {
	const variableMessages = parseMessages.filter(isInvalidVariableNameMessage);
	if (variableMessages.length !== 0) {
		const toRemove = new Set();
		const tokensAffected = new Set();
		variableMessages.forEach(function(variableMessage) {
			const token = getInstructionListChildToken(variableMessage.token);
			SetUtils.addAll(tokensAffected, token.getAllDescendentsAsArray());
			tokensAffected.add(token);
		});
		const newMessages = parseMessages.filter(m => !tokensAffected.has(m.token) || !isRemovable(m));
		parseMessages.length = 0;
		parseMessages.push(...newMessages);
	}
};