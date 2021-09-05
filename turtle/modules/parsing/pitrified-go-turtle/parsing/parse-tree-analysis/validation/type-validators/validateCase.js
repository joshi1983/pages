import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateCase(token, parseLogger) {
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.SWITCH_BLOCK)
		parseLogger.error(`Expected SWITCH_BLOCK to be a parent for CASE but found ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	if (token.children.length === 0 || token.children.length > 2)
		parseLogger.error(`Expected 1 or 2 children for CASE but found ${token.children.length}`, token);
	else {
		const lastChildToken = token.children[token.children.length - 1];
		if (lastChildToken.type !== ParseTreeTokenType.CODE_BLOCK)
			parseLogger.error(`Expected last child of CASE to be a CODE_BLOCK but found ${ParseTreeTokenType.getNameFor(lastChildToken.type)}`, token);
	}
};