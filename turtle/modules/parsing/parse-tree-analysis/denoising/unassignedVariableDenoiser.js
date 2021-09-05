import { SetUtils } from '../../../SetUtils.js';
import { getInstructionListChildToken } from '../getInstructionListChildToken.js';

function isUnassignedVariableMessage(msg) {
	return msg.msg.indexOf('not assigned a value before reading') !== -1;
}

function isRemovable(msg) {
	return msg.msg.indexOf('requires input of type') !== -1 ||
		msg.msg.indexOf('requires input of type') !== -1 ||
		msg.msg.indexOf('must be of type') !== -1;
}

export function unassignedVariableDenoiser(cachedParseTree, parseMessages) {
	const variableMessages = parseMessages.filter(isUnassignedVariableMessage);
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