import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const firstChildTypes = new Set([
	ParseTreeTokenType.EXPRESSION_DOT,
	ParseTreeTokenType.IDENTIFIER
]);

export function validateMethodCall(token, parseLogger) {
	const children = token.children;
	if (children.length !== 2)
		parseLogger.error(`Expected to have 2 children for a METHOD_CALL but found ${children.length}`, token);
	else {
		const first = children[0];
		const second = children[1];
		if (!firstChildTypes.has(first.type))
			parseLogger.error(`Expected METHOD_CALL first child to be from ${Array.from(firstChildTypes).map(t => ParseTreeTokenType.getNameFor(t)).join(',')} but got ${ParseTreeTokenType.getNameFor(first.type)}`, token);
		if (second.type !== ParseTreeTokenType.ARG_LIST)
			parseLogger.error(`Expected METHOD_CALL second child to be ARG_LIST to have a parent in the types ${Array.from(parentTypes).map(t => ParseTreeTokenType.getNameFor(t))} but got ${ParseTreeTokenType.getNameFor(last.type)}`, token);
	}
};