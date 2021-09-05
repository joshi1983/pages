import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const childTypes = new Set([
	ParseTreeTokenType.ARRAY_INSTANCE_EXPRESSION,
	ParseTreeTokenType.METHOD_CALL,
]);

export function validateNew(token, parseLogger) {
	const children = token.children;
	if (children.length === 0)
		parseLogger.error(`NEW tokens should have at least 1 child but found ${children.length}`, token);
	else if (children.length === 1) {
		const child = children[0];
		if (!childTypes.has(child.type)) {
			parseLogger.error(`NEW token should have a child with a type from ${Array.from(childTypes).map(t => ParseTreeTokenType.getNameFor(t.type)).join(',')} but found ${ParseTreeTokenType.getNameFor(child.type)}`, child);
		}
	}
};