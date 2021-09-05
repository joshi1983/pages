import { functionDefinitionTypes } from '../../../functionDefinitionTypes.js';
import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';
import { SetUtils } from '../../../../../../SetUtils.js';

const badChildTypes = new Set([
	ParseTreeTokenType.CASE,
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.DO,
	ParseTreeTokenType.END,
	ParseTreeTokenType.END_DEF,
	ParseTreeTokenType.END_FUNCTION,
	ParseTreeTokenType.END_IF,
	ParseTreeTokenType.END_SUB,
	ParseTreeTokenType.END_TYPE,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.LOOP,
	ParseTreeTokenType.NEXT,
	ParseTreeTokenType.SELECT,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
	ParseTreeTokenType.TYPE,
	ParseTreeTokenType.UNTIL,
	ParseTreeTokenType.WEND,
	ParseTreeTokenType.WHILE,
]);
SetUtils.addAll(badChildTypes, functionDefinitionTypes);

export function validateBinaryOperator(token, parseLogger) {
	if (token.children.length !== 2) {
		parseLogger.error(`Expected a BINARY_OPERATOR to have 2 children but found ${token.children.length}`, token);
	}
	token.children.forEach(function(child) {
		if (badChildTypes.has(child.type))
			parseLogger.error(`Expected a BINARY_OPERATOR to not have a child of type ${ParseTreeTokenType.getNameFor(child.type)}`, token);
	});
};