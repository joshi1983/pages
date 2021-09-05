import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateLoop(token, parseLogger) {
	const children = token.children;
	if (children.length === 2) {
		const first = children[0];
		const second = children[1];
		if (first.type !== ParseTreeTokenType.CODE_BLOCK)
			parseLogger.error(`Expected first child to be a code block but got type ${ParseTreeTokenType.getNameFor(first.type)}`, token);
		if (second.type !== ParseTreeTokenType.END_LOOP)
			parseLogger.error(`Expected second child to be END_LOOP but got type ${ParseTreeTokenType.getNameFor(second.type)}`, token);
	}
};