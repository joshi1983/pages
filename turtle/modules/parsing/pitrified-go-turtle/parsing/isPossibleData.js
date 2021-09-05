import { isComplete } from './isCompleteWithNext.js';
import { MaybeDecided } from '../../../MaybeDecided.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const nonDataTokenTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.BREAK,
	ParseTreeTokenType.CASE,
	ParseTreeTokenType.CHAN,
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.CONST_DECLARATION_LIST,
	ParseTreeTokenType.CONTINUE,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.ELSE_IF,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.FUNC,
	ParseTreeTokenType.GOTO,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.IMPORT,
	ParseTreeTokenType.IMPORT_PACKAGE_LIST,
	ParseTreeTokenType.INTERFACE,
	ParseTreeTokenType.LABEL,
	ParseTreeTokenType.PACKAGE,
	ParseTreeTokenType.SELECT,
	ParseTreeTokenType.SELECT_BODY,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
	ParseTreeTokenType.STRUCT,
	ParseTreeTokenType.STRUCT_VALUES_EXPRESSION,
	ParseTreeTokenType.SWITCH,
	ParseTreeTokenType.SWITCH_BODY,
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.VAR
]);

export function isPossibleData(token) {
	if (nonDataTokenTypes.has(token.type))
		return false;
	const parent = token.parentNode;
	if (token.type === ParseTreeTokenType.IDENTIFIER &&
	parent.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY &&
	parent.children.indexOf(token) === 2)
		return false; // the x in p.x won't evaluate to a data value.
		// The whole p.x expression can evaluate to a data value but that's a different token.  That would be parent.

	if (token.type === ParseTreeTokenType.IDENTIFIER) {
		if (parent.type === ParseTreeTokenType.FUNC ||
		parent.type === ParseTreeTokenType.FUNC_CALL)
			return false;
	}
	if (isComplete(token) === MaybeDecided.No)
		return false;
	return true;
};