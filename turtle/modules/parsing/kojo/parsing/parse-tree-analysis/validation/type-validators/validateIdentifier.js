import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const goodChildTypes = new Set([
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.DATA_TYPE_EXPRESSION,
	ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION,
	ParseTreeTokenType.UNARY_OPERATOR
]);

function isEventHandlerCodeBlock(token) {
	if (token.type !== ParseTreeTokenType.CODE_BLOCK)
		return false;
	if (token.parentNode.parentNode.type !== ParseTreeTokenType.TREE_ROOT)
		return false;
	return true;
}

export function validateIdentifier(token, parseLogger) {
	const children = token.children;
	if (children.length > 2)
		parseLogger.error(`Expected at most 2 children for IDENTIFIER but found ${children.length}`, token);
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (i === 0 && !goodChildTypes.has(child.type)) {
			if (!isEventHandlerCodeBlock(child))
				parseLogger.error(`Did not expect IDENTIFIER to have a child of type ${ParseTreeTokenType.getNameFor(child.type)}`, token);
		}
	}
};