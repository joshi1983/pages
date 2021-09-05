import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateFor(token, parseLogger) {
	if (token.children.length !== 2)
		parseLogger.error(`Expected 2 children for FOR but found ${token.children.length}`, token);
	else {
		const toToken = token.children[0];
		const codeBlock = token.children[1];
		if (toToken.type !== ParseTreeTokenType.TO)
			parseLogger.error(`Expected first child of FOR to be a TO but found ${ParseTreeTokenType.getNameFor(toToken.type)}`, token)
		if (codeBlock.type !== ParseTreeTokenType.CODE_BLOCK)
			parseLogger.error(`Expected second child of FOR to be a CODE_BLOCK but found ${ParseTreeTokenType.getNameFor(codeBlock.type)}`, token)
	}
};