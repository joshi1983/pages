import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateCodeBlock(token, parseLogger) {
	const children = token.children;
	if (children.length < 2) {
		parseLogger.error(`Expected a CODE_BLOCK to have at least 2 child tokens but found ${children.length}`, token);
	}
	else {
		const first = children[0];
		const last = children[children.length - 1];
		if (first.type !== ParseTreeTokenType.CURLY_LEFT_BRACKET)
			parseLogger.error(`Expected first child of a CODE_BLOCK to be a { but found ${ParseTreeTokenType.getNameFor(first.type)}`, token);
		if (last.type !== ParseTreeTokenType.CURLY_RIGHT_BRACKET)
			parseLogger.error(`Expected last child of a CODE_BLOCK to be a } but found ${ParseTreeTokenType.getNameFor(last.type)}`, token);
	}
};