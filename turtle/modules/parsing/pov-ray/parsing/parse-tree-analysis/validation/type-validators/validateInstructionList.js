import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateInstructionList(token, parseLogger) {
	if (token.parentNode === ParseTreeTokenType.TREE_ROOT)
		parseLogger.error(`An instruction list should not be a direct child of a TREE_ROOT.`, token);
};