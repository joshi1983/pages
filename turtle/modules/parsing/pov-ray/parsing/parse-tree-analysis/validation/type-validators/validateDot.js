import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

const parentTypes = new Set([
ParseTreeTokenType.DOT_PROPERTY,
ParseTreeTokenType.EXPRESSION_DOT_PROPERTY,
]);

export function validateDot(token, parseLogger) {
	const children = token.children;
	const parent = token.parentNode;
	if (parent === null)
		parseLogger.error(`Did not expect parent of DOT to not be null`, token);
	else if (!parentTypes.has(parent.type))
		parseLogger.error(`Expected parent of DOT to be one of ${Array.from(parentTypes).map(t => ParseTreeTokenType.getNameFor(t)).join(',')} but found type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	if (token.children.length !== 0)
		parseLogger.error(`Expected 0 children of DOT but found ${token.children.length}`, token);
};