const typeNames = [];

export class ParseTreeTokenType {
	static getNameFor(type) {
		return typeNames[type];
	}
};

[
'ASSIGNMENT_OPERATOR',
'BINARY_OPERATOR',
'BOOLEAN_LITERAL',
'CODE_BLOCK',
'COMMA',
'COMMENT',
'CURLY_LEFT_BRACKET',
'CURLY_RIGHT_BRACKET',
'CURVED_BRACKET_EXPRESSION',
'CURVED_LEFT_BRACKET',
'CURVED_RIGHT_BRACKET',
'ELSE',
'FOR',
'IDENTIFIER',
'IF',
'KTURTLE_VERSION_DECLARATION',
'LEARN',
'NUMBER_LITERAL',
'PARAMETERIZED_GROUP',
'PARAMETERS_PARENT',
'REPEAT',
'STRING_LITERAL',
'TO', // Unlike most Logo varients, 
// 'to' is used by KTurtle in for-loop settings and not to teach how to do procedures.
'TREE_ROOT',
'UNARY_OPERATOR',
'VARIABLE_REFERENCE',
'WHILE',
'WRAP_START',
].forEach(function(key, index) {
	index++;
	ParseTreeTokenType[key] = index;
	typeNames[index] = key;
});