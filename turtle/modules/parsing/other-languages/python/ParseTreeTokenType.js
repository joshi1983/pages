const typeNames = [];

export class ParseTreeTokenType {

	static getNameFor(typeInteger) {
		return typeNames[typeInteger];
	}
};

const enumKeys = [
	'ARGUMENT_LIST',
	'ARGUMENT_STAR',
	'AS', // for example, import numpy as np
	'ASSERT', // assert
	'ASSIGNMENT_OPERATOR', // =, +=, -=...
	// An assignment operator is a kind of binary operator that assigns a value to a variable or property.

	'ASTRIX_WILDCARD', // * used in special situations that are not binary operators.
	'ASYNC', // async
	'AWAIT', // await
	'BINARY_OPERATOR',
	'BOOLEAN_LITERAL', // Example, True
	'BREAK', // break
	'BYTES_LITERAL',
	'CLASS', // class
	'CLASS_BODY', // used in the new Python parser as a child of a CLASS token
	'CODE_BLOCK',
	'COLON', // :
	'COMMA', // ,
	'COMMA_EXPRESSION', // similar to tuple literals but without the ( ) brackets around them
	'CONTINUE', // continue
	'CURLY_LEFT_BRACKET', // {
	'CURLY_RIGHT_BRACKET', // }
	'CURVED_BRACKET_EXPRESSION', // For example, (1 + 3)
	// Not a tuple

	'CURVED_LEFT_BRACKET', // (
	'CURVED_RIGHT_BRACKET', // )
	'DEF', // def keyword
	'DECORATOR', // like @staticmethod... basically tokens starting with @
	'DICTIONARY_LITERAL', // for example, {'x': 4}
	'DICTIONARY_KEY_VALUE_PAIR',
	'DOCSTRING', // basically, a LONG_STRING_LITERAL immediately after the start of a function or class.
	'DOT', // Used for refering to properties and methods. A period symbol
	'ELIF',
	'ELSE',
	'ESCAPED_LINEBREAK',
	'EXCEPT', // used by the new python parser for the except keyword that is in some try-except structures
	'EXPRESSION_DOT',
	'FINALLY',
	'FOR_LOOP',
	'FUNCTION_CALL', // example: p(123)
	'FUNCTION_DEFINITION', // example p num1: pass
	'GENERAL_STATEMENT',
	'GLOBAL',
	'IDENTIFIER',
	'IF_STATEMENT',
	'IMPORT',
	'IN', // Example: 2 in [1,2,3]
	'INDENT', // used by the new Python parser to represent tabs and whitespaces for indentation of blocks of code
	'KWARGS_SYMBOL', // for example, def fun(**kwargs)
	'LIST_LITERAL', // Example: [1, 2]
	'LONG_STRING_LITERAL',
	'NONE',
	'NUMBER_LITERAL', // Example, 123
	'PASS', // pass
	'RETURN',
	'SEMICOLON', // ;
	'SINGLE_LINE_COMMENT',
	'SQUARE_LEFT_BRACKET', // [
	'SQUARE_RIGHT_BRACKET', // ]
	'STRING_LITERAL', // Example, '123'
	'SUBSCRIPT',  // Example, list1[4] where the [4] corresponds with the subscript.
	'SUBSCRIPT_EXPRESSION',
	'TREE_ROOT',
	'TRY',
	'TUPLE_LITERAL', // Example: (1, 2)
	'UNARY_OPERATOR', // -, ~, not
	'UNRECOGNIZED', // for any unrecognized types.
	'WHILE_LOOP',
	'WITH',
	'YIELD'
];

enumKeys.forEach(function(key, index) {
	ParseTreeTokenType[key] = index + 1;
});

const keys = Object.keys(ParseTreeTokenType).filter(key => Number.isInteger(ParseTreeTokenType[key]));
keys.forEach(function(key) {
	typeNames[ParseTreeTokenType[key]] = key;
});