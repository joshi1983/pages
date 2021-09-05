import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const badValueTokenTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.DIM,
	ParseTreeTokenType.DO,
	ParseTreeTokenType.END,
	ParseTreeTokenType.END_DEF,
	ParseTreeTokenType.END_FUNCTION,
	ParseTreeTokenType.END_IF,
	ParseTreeTokenType.END_SUB,
	ParseTreeTokenType.END_TYPE,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.LET,
	ParseTreeTokenType.LOOP,
	ParseTreeTokenType.REDIM,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.THEN,
	ParseTreeTokenType.TYPE,
	ParseTreeTokenType.TYPE_PROPERTY,
	ParseTreeTokenType.UNTIL,
	ParseTreeTokenType.WHILE,
]);

export { badValueTokenTypes };