import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateForLoop(token, parseLogger) {
	const children = token.children;
	if (children.length < 5)
		parseLogger.error(`An FOR_LOOP must have at least 5 children but found ${children.length}`, token);
	else {
		const codeBlock = children[4];
		if (codeBlock.type !== ParseTreeTokenType.CODE_BLOCK)
			parseLogger.error(`children[4] of a FOR_LOOP should be a CODE_BLOCK but found type ${ParseTreeTokenType.getNameFor(codeBlock.type)}`, token);
	}
};