import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateArrayInstanceExpression(token, parseLogger) {
	const children = token.children;
	for (let i = 1; i < children.length; i++) {
		const child = children[i];
		if (child.type !== ParseTreeTokenType.INDEX_EXPRESSION)
			parseLogger.error(`Expected child [${i}] to be an INDEX_EXPRESSION but found type ${ParseTreeTokenType.getNameFor(child.type)}`, child);
	}
};