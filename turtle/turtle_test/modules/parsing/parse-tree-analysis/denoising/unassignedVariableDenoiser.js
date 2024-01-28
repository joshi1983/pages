import { ArrayUtils } from '../../../ArrayUtils.js';
import { getAllDescendentsAsArray } from '../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getInstructionListChildToken } from '../getInstructionListChildToken.js';
import { SetUtils } from '../../../SetUtils.js';

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
	const tokensAffected = new Set();
	variableMessages.forEach(function(variableMessage) {
		const token = getInstructionListChildToken(variableMessage.token);
		SetUtils.addAll(tokensAffected, getAllDescendentsAsArray(token));
		tokensAffected.add(token);
	});
	ArrayUtils.remove(parseMessages, m => !tokensAffected.has(m.token) || !isRemovable(m));
};