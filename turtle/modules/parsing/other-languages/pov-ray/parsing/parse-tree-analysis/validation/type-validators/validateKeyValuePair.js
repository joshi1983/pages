import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

const parentTypes = new Set([
	ParseTreeTokenType.CURLY_BRACKET_EXPRESSION
]);
const firstChildTypes = new Set([
	ParseTreeTokenType.DOT_PROPERTY,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION,
]);

export function validateKeyValuePair(token, parseLogger) {
	const children = token.children;
	const parent = token.parentNode;
	if (parent === null)
		parseLogger.error(`Did not expect parent of KEY_VALUE_PAIR to not be null`, token);
	else if (!parentTypes.has(parent.type))
		parseLogger.error(`Expected parent of KEY_VALUE_PAIR to be one of ${Array.from(parentTypes).map(t => ParseTreeTokenType.getNameFor(t)).join(',')} but found type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	if (token.children.length !== 3)
		parseLogger.error(`Expected 3 children but found ${token.children.length}`, token);
	else {
		const firstChild = children[0];
		if (!firstChildTypes.has(firstChild.type))
			parseLogger.error(`Expected first child of KEY_VALUE_PAIR to be one of ${Array.from(firstChildTypes).map(t => ParseTreeTokenType.getNameFor(t)).join(',')} but got ${ParseTreeTokenType.getNameFor(firstChild.type)}`, token);
	}
};