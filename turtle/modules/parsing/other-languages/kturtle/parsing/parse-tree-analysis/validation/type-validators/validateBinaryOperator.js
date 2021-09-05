import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const badChildTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
	ParseTreeTokenType.LEARN,
	ParseTreeTokenType.PARAMETERS_PARENT,
]);

export function validateBinaryOperator(token, parseLogger) {
	if (token.children.length !== 2) {
		parseLogger.error(`Expected a BINARY_OPERATOR to have 2 children but found ${token.children.length}`, token);
	}
	token.children.forEach(function(child) {
		if (badChildTypes.has(child.type))
			parseLogger.error(`Expected a BINARY_OPERATOR to not have a child of type ${ParseTreeTokenType.getNameFor(child.type)}`, token);
	});
};