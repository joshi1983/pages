import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateConstructor(token, parseLogger) {
	const children = token.children;
	if (children.length !== 2) {
		parseLogger.error(`Expected there to be 2 children in a CONSTRUCTOR but found ${children.length}`, token);
	}
	else {
		const first = children[0];
		const last = children[1];
		if (first.type !== ParseTreeTokenType.ARG_LIST)
			parseLogger.error(`Expected first child in a CONSTRUCTOR to be an ARG_LIST but found ${ParseTreeTokenType.getNameFor(first.type)}`, token);
		if (last.type !== ParseTreeTokenType.CODE_BLOCK)
			parseLogger.error(`Expected last child in a CONSTRUCTOR to be a CODE_BLOCK but found ${ParseTreeTokenType.getNameFor(last.type)}`, token);
	}
};