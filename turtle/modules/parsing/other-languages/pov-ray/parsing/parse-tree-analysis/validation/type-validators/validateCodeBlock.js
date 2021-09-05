import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

export function validateCodeBlock(token, parseLogger) {
	const children = token.children;
	if (token.val !== null)
		parseLogger.error(`Expected val to be null but found ${token.val}`, token);
	if (children.length !== 3)
		parseLogger.error(`Expected 3 children for a CODE_BLOCK but got ${children.length}`, token);
	else {
		const first = token.children[0];
		const last = token.children[token.children.length - 1];
		if (first.type !== ParseTreeTokenType.CURLY_LEFT_BRACKET)
			parseLogger.error(`Expected first child of CODE_BLOCK to be { but got ${first.val} which is of type ${ParseTreeTokenType.getNameFor(first.type)}`, first);
		if (last.type !== ParseTreeTokenType.CURLY_RIGHT_BRACKET)
			parseLogger.error(`Expected last child of CODE_BLOCK to be } but got ${last.val} which is of type ${ParseTreeTokenType.getNameFor(last.type)}`, last);
	}
};