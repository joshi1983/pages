import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const childTypes = new Set([
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.IDENTIFIER
]);

export function validateImplements(token, parseLogger) {
	const children = token.children;
	if (children.length === 0)
		parseLogger.error(`implements should have at least 1 child token but found 0`, token);
	else {
		for (const child of children) {
			if (!childTypes.has(child.type))
				parseLogger.error(`The only valid child types for implements are ${Array.from(childTypes).map(t => ParseTreeTokenType.getNameFor(t)).join(',')} but found type ${ParseTreeTokenType.getNameFor(child.type)}`, child);
		}
	}
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.CLASS) {
		parseLogger.error(`The only valid parent type for implements is CLASS but found type ${ParseTreeTokenType.getNameFor(parent.type)}`, parent);
	}
};