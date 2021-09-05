import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const parentTypes = new Set([
	ParseTreeTokenType.ARROW,
	ParseTreeTokenType.ASSIGNMENT,
	ParseTreeTokenType.COMMAND_SEQUENCE,
	ParseTreeTokenType.COMPOSITE_IDENTIFIER
]);

export function validateIdentifier(token, parseLogger) {
	const children = token.children;
	const parent = token.parentNode;
	if (children.length !== 0)
		parseLogger.error(`Expected 0 children for an IDENTIFIER token but found ${children.length}`, token);
	if (!parentTypes.has(parent.type)) {
		parseLogger.error(`Did not expect an IDENTIFIER to have a parent of type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	}
};