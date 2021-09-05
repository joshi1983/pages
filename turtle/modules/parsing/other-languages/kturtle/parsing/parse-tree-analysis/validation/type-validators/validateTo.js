import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const limitTokenTypes = new Set([
ParseTreeTokenType.BINARY_OPERATOR,
ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.PARAMETERIZED_GROUP,
ParseTreeTokenType.VARIABLE_REFERENCE
]);

export function validateTo(token, parseLogger) {
	if (token.children.length !== 2)
		parseLogger.error(`Expected 2 children for TO but found ${token.children.length}`, token);
	else {
		const assignToken = token.children[0];
		const limitToken = token.children[1];
		if (assignToken.type !== ParseTreeTokenType.ASSIGNMENT_OPERATOR)
			parseLogger.error(`Expected first child of TO to be a ASSIGNMENT_OPERATOR but found ${ParseTreeTokenType.getNameFor(assignToken.type)}`, token)
		if (!limitTokenTypes.has(limitToken.type))
			parseLogger.error(`Expected second child of TO to not be a ${ParseTreeTokenType.getNameFor(limitToken.type)}`, token)
	}
};