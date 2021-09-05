import { Command } from '../../../../parsing/Command.js';
import { formatToken } from './formatToken.js';
import { isInstructionListChild } from '../../../../parsing/parse-tree-analysis/getInstructionListChildToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
await Command.asyncInit();

export function formatPrefixed(token, logger) {
	let isSeparateLine = false;
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.val);
		if ((info !== undefined && Command.getReturnTypes(info) === null) || isInstructionListChild(token))
			isSeparateLine = true;
	}
	if (isSeparateLine)
		logger.newLine();
	logger.log(token.val, token);
	token.children.forEach(function(child) {
		formatToken(child, logger);
	});

	if (isSeparateLine)
		logger.newLine();
};