import { formatToken } from './formatToken.js';
import { isInstructionList } from '../../../../parsing/parse-tree-analysis/isInstructionList.js';

export function formatList(lToken, logger) {
	if (lToken.children.length < 2)
		return;
	logger.log('[', lToken.children[0]);
	const isInstructionList_ = isInstructionList(lToken);
	if (isInstructionList_)
		logger.newLine();
	logger.indent();
	lToken.children.filter(t => t.val !== '[' && t.val !== ']').forEach(function(child) {
		if (isInstructionList_)
			logger.newLine();
		formatToken(child, logger);
	});
	if (isInstructionList_)
		logger.newLine();
	logger.deindent();
	logger.log(']', lToken.children[lToken.children.length - 1]);
};