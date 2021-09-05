import { ArrayUtils } from '../../../ArrayUtils.js';
import { getAllDescendentsAsArray } from '../../parse-tree-token/getAllDescendentsAsArray.js';
import { getInstructionListChildToken } from '../getInstructionListChildToken.js';
import { SetUtils } from '../../../SetUtils.js';

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
			SetUtils.addAll(tokensAffected, getAllDescendentsAsArray(token));
			tokensAffected.add(token);
		});
		ArrayUtils.remove(parseMessages, m => !tokensAffected.has(m.token) || !isRemovable(m));
	}
};