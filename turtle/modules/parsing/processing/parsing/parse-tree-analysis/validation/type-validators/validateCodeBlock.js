import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateCodeBlock(token, parseLogger) {
	const children = token.children;
	if (children.length === 0) {
		parseLogger.error(`Expected there to be at least 1 child in a CODE_BLOCK but found none`, token);
	}
	else {
		const first = children[0];
		if (first.type === ParseTreeTokenType.CURLY_LEFT_BRACKET && children.length === 1)
			parseLogger.error(`Expected more than 1 child in a CODE_BLOCK when first is { but found exactly 1 child`, token);
		else if (children.length > 1) {
			const last = children[children.length - 1];
			if (first.type === ParseTreeTokenType.CURLY_LEFT_BRACKET &&
			last.type !== ParseTreeTokenType.CURLY_RIGHT_BRACKET)
				parseLogger.error(`Expected { } to be balanced but it is not. last type found is ${ParseTreeTokenType.getNameFor(last.type)}`, token);
		}
	}
};