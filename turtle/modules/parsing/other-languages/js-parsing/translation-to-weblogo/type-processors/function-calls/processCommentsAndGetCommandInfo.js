import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { getDeepestName } from '../processFunctionCall.js';
import { tokenToCommandInfo } from './tokenToCommandInfo.js';

export function processCommentsAndGetCommandInfo(token, result, commandsToInfo) {
	if (token.parentNode.type === ParseTreeTokenType.TREE_ROOT ||
	token.parentNode.type === ParseTreeTokenType.CODE_BLOCK) {
		result.processCommentsUpToToken(token);
	}
	const deepestName = getDeepestName(token);
	let commandsMatchedByName = commandsToInfo.get(deepestName);
	if (commandsMatchedByName === undefined)
		commandsMatchedByName = [];
	return tokenToCommandInfo(token, commandsMatchedByName);
};