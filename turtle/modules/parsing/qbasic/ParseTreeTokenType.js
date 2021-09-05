const typeNames = [];

export class ParseTreeTokenType {
	static getNameFor(type) {
		return typeNames[type];
	}
};

[
'ARG_LIST',
'AS',
'ASSIGNMENT',
'BINARY_OPERATOR',
'CALL', // call
'CASE', // case
'CODE_BLOCK',
'COLON', // :
'COMMA', // ,
'COMMENT', // REM or '
'COMMON',
'CONST',
'CURVED_BRACKET_EXPRESSION',
'CURVED_LEFT_BRACKET',
'CURVED_RIGHT_BRACKET',
'DATA_TYPE',
'DECLARE',
'DEF',// like: DEF fnTest
'DEF_PRIMITIVE', // DEFINT, DEFLNG, DEFSNG, DEFDBL, DEFSTR
'DIM',
'DO',
'DO_UNTIL',
'DO_WHILE',
'DOT',
'ELSE',
'ELSEIF',
'END',
'END_DEF',
'END_FUNCTION',
'END_IF',
'END_SELECT',
'END_SUB',
'END_TYPE',
'EXIT',
'EXPRESSION_DOT',
'FOR',
'FUNCTION',
'FUNCTION_CALL',// or subroutine call
'GOSUB', // gosub.. a call to a subroutine indicated by a label.
'IDENTIFIER',
'IF',
'LET',
'LABEL',
'LOOP',
'LOOP_UNTIL',
'LOOP_WHILE',
'NEXT',
'NUMBER_LITERAL',
'ON',
'REDIM',
'RETURN',
'SELECT', // select case statement
'SEMICOLON', // ;
'SHARED',
'SQUARE_LEFT_BRACKET',
'SQUARE_RIGHT_BRACKET',
'STEP',
'STRING_LITERAL',
'SUB',
'THEN',
'TREE_ROOT',
'TUPLE_LITERAL', // For example, (123, 456) in a call to the line subroutine
'TYPE',
'TYPE_PROPERTY',
'UNARY_OPERATOR',
'UNMATCHED',
'UNTIL',
'WEND',
'WHILE',
].forEach(function(key, index) {
	index++;
	ParseTreeTokenType[key] = index;
	typeNames[index] = key;
});