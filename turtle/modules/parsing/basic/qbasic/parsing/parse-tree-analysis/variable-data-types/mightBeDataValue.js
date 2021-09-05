import { functionDefinitionTypes } from '../../functionDefinitionTypes.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { QBasicInternalFunctions } from
'../../../QBasicInternalFunctions.js';
import { SetUtils } from
'../../../../../../SetUtils.js';

const nonDataTokenTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.AS,
	ParseTreeTokenType.CASE,
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.DATA_TYPE,
	ParseTreeTokenType.DECLARE,
	ParseTreeTokenType.DEF_PRIMITIVE,
	ParseTreeTokenType.DIM,
	ParseTreeTokenType.DO,
	ParseTreeTokenType.DO_UNTIL,
	ParseTreeTokenType.DO_WHILE,
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.ELSEIF,
	ParseTreeTokenType.END,
	ParseTreeTokenType.END_DEF,
	ParseTreeTokenType.END_IF,
	ParseTreeTokenType.END_FUNCTION,
	ParseTreeTokenType.END_SUB,
	ParseTreeTokenType.EXIT,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.LABEL,
	ParseTreeTokenType.LET,
	ParseTreeTokenType.LOOP,
	ParseTreeTokenType.LOOP_UNTIL,
	ParseTreeTokenType.LOOP_WHILE,
	ParseTreeTokenType.NEXT,
	ParseTreeTokenType.ON,
	ParseTreeTokenType.REDIM,
	ParseTreeTokenType.RETURN,
	ParseTreeTokenType.SELECT,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.SHARED,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
	ParseTreeTokenType.STEP,
	ParseTreeTokenType.THEN,
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.TYPE,
	ParseTreeTokenType.TYPE_PROPERTY,
	ParseTreeTokenType.UNTIL,
	ParseTreeTokenType.WEND,
	ParseTreeTokenType.WHILE,
]);
SetUtils.addAll(nonDataTokenTypes, functionDefinitionTypes);

export function mightBeDataValue(token) {
	if (nonDataTokenTypes.has(token.type))
		return false;
	if (token.type === ParseTreeTokenType.FUNCTION_CALL) {
		const firstChild = token.children[0];
		if (firstChild !== undefined &&
		firstChild.type === ParseTreeTokenType.IDENTIFIER) {
			const info = QBasicInternalFunctions.getFunctionInfo(firstChild.val);
			if (info !== undefined && info.returnTypes === null)
				return false;
		}
	}
	if (token.type === ParseTreeTokenType.IDENTIFIER) {
		const parent = token.parentNode;
		if (parent !== null &&
		parent.type === ParseTreeTokenType.FUNCTION_CALL &&
		parent.children.indexOf(token) === 0)
			return false; // the function name within a function call can't evaluate to a data value.
	}
	return true;
};