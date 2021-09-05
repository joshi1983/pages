const typeNames = [];

export class ParseTreeTokenType {

	static getNameFor(typeInteger) {
		return typeNames[typeInteger];
	}
};

const enumKeys = [
	'ARGUMENT',
	'ARGUMENT_LIST',
	'ARGUMENT_STAR',
	'ASSERT', // assert
	'ASSIGNMENT_OPERATOR', // =, +=, -=...
	// An assignment operator is a kind of binary operator that assigns a value to a variable or property.

	'ASYNC', // async
	'AWAIT', // await
	'BINARY_OPERATOR',
	'BOOLEAN_LITERAL', // Example, True
	'BREAK', // break
	'CLASS', // class
	'COLON', // :
	'COMMA', // ,
	'CONTINUE', // continue
	'CURLY_LEFT_BRACKET', // {
	'CURLY_RIGHT_BRACKET', // }
	'CURVED_BRACKET_EXPRESSION', // For example, (1 + 3)
	// Not a tuple

	'CURVED_LEFT_BRACKET', // (
	'CURVED_RIGHT_BRACKET', // )
	'DICTIONARY_LITERAL', // for example, {'x': 4}
	'DEF', // def keyword
	'DOCSTRING', // basically, a LONG_STRING_LITERAL immediately after the start of a function or class.
	'DOT', // Used for refering to properties and methods. A period symbol
	'FOR_LOOP',
	'FUNCTION_CALL', // example: p(123)
	'FUNCTION_DEFINITION', // example p num1: pass
	'GENERAL_STATEMENT',
	'GLOBAL',
	'IDENTIFIER',
	'IF_STATEMENT',
	'IMPORT',
	'IN', // Example: 2 in [1,2,3]
	'LIST_LITERAL', // Example: [1, 2]
	'LONG_STRING_LITERAL',
	'NONE',
	'NOT',
	'NUMBER_LITERAL', // Example, 123
	'PASS', // pass
	'PRINT',
	/*
	All PRINT tokens are converted to FUNCTION_CALL tokens through restructureParseTree.
	
	They're initially treated as a separate type because print statements in Python 2 have distinct syntax.
	print 'hi' is valid in Python 2.
	Brackets like any other function call are needed in Python 3.
	For example print('hi').
	*/
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
	'TRY_EXCEPT',
	'TUPLE_LITERAL', // Example: (1, 2)
	'UNARY_OPERATOR', // -, not
	'UNRECOGNIZED', // for any unrecognized types.
	'WHILE_LOOP',
	'WITH'
];

enumKeys.forEach(function(key, index) {
	ParseTreeTokenType[key] = index + 1;
});

const keys = Object.keys(ParseTreeTokenType).filter(key => Number.isInteger(ParseTreeTokenType[key]));
keys.forEach(function(key) {
	typeNames[ParseTreeTokenType[key]] = key;
});