const typeNames = [];

export class ParseTreeTokenType {
	static getNameFor(type) {
		return typeNames[type];
	}
};

[
'ABSOLUTE_EXPRESSION',
'ARG_LIST',
'ASSIGNMENT_OPERATOR',
'BINARY_OPERATOR',
'COLON',
'COMMA',
'CURVED_BRACKET_EXPRESSION',
'CURVED_LEFT_BRACKET',
'CURVED_RIGHT_BRACKET',
'FOR',
'FUNCTION_CALL',
'IDENTIFIER',
'IF',
'IN',
'LET',
'LINE_OF_CODE',
'NUMBER_LITERAL',
'PAGE', // page or part
'PERIOD', // .
'PIPE', // |
'SEMICOLON', // ;
'SET',
'SQUARE_BRACKET_EXPRESSION',
'SQUARE_CASE',
'SQUARE_LEFT_BRACKET',
'SQUARE_RIGHT_BRACKET',
'STRING_LITERAL',
'TO',
'TREE_ROOT',
'UNARY_OPERATOR',
'WHILE',
].forEach(function(key, index) {
	index++;
	ParseTreeTokenType[key] = index;
	typeNames[index] = key;
});