import { ExpectedChildrenResult, hasAllExpectedChildren } from './hasAllExpectedChildren.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { PovRayCommand } from '../PovRayCommand.js';

const valueTokenTypes = new Set([
ParseTreeTokenType.BINARY_OPERATOR,
ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
ParseTreeTokenType.DICTIONARY,
ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
ParseTreeTokenType.FUNCTION,
ParseTreeTokenType.IDENTIFIER,
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.PARAMETERIZED_GROUP,
ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION,
ParseTreeTokenType.STRING_LITERAL,
ParseTreeTokenType.UNARY_OPERATOR,
ParseTreeTokenType.VECTOR_EXPRESSION,
]);
const nonTokenValueTypes = new Set([
ParseTreeTokenType.ANGLE_LEFT_BRACKET,
ParseTreeTokenType.ANGLE_RIGHT_BRACKET,
ParseTreeTokenType.ARG_LIST, 
// a PARAMETERIZED_GROUP can evaluate to a value but not an ARG_LIST.
ParseTreeTokenType.BREAK,
ParseTreeTokenType.CASE,
ParseTreeTokenType.COLON,
ParseTreeTokenType.COMMA,
ParseTreeTokenType.CURLY_LEFT_BRACKET,
ParseTreeTokenType.CURLY_RIGHT_BRACKET,
ParseTreeTokenType.CURVED_LEFT_BRACKET,
ParseTreeTokenType.CURVED_RIGHT_BRACKET,
ParseTreeTokenType.DECLARE,
ParseTreeTokenType.ELSE,
ParseTreeTokenType.END,
ParseTreeTokenType.IF,
ParseTreeTokenType.IFDEF,
ParseTreeTokenType.IFNDEF,
ParseTreeTokenType.INSTRUCTION_LIST,
ParseTreeTokenType.LOCAL,
ParseTreeTokenType.MACRO,
ParseTreeTokenType.QUESTION_MARK,
ParseTreeTokenType.SEMICOLON,
ParseTreeTokenType.SQUARE_LEFT_BRACKET,
ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
ParseTreeTokenType.SWITCH,
ParseTreeTokenType.TREE_ROOT,
ParseTreeTokenType.WHILE,
]);
export { valueTokenTypes };

export function isCompleteValueToken(token) {
	if (!valueTokenTypes.has(token.type))
		return false;
	if (!ExpectedChildrenResult.canBeComplete(hasAllExpectedChildren(token))) {
		return false;
	}
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = PovRayCommand.getCommandInfo(token.val);
		if (info !== undefined) {
			const returnTypes = PovRayCommand.getReturnTypes(info);
			if (returnTypes === null)
				return false;
		}
	}
	if (nonTokenValueTypes.has(token.type))
		return false;
	return true;
};