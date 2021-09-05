const typeNames = [];

export class ParseTreeTokenType {

	static getNameFor(typeInteger) {
		return typeNames[typeInteger];
	}
};

const enumKeys = [
	'ARG_LIST', // for example (1, 3, 4)
	'ARRAY_DATATYPE_EXPRESSION', // For example int[]
	'ARRAY_DIMENSION_INDICATOR', // For example []
	'ARRAY_INSTANCE_EXPRESSION', // For example int[3] from new int[3];
	'ASSIGNMENT_OPERATOR', // =, +=, -=...
	// An assignment operator is a kind of binary operator that assigns a value to a variable or property.

	'BINARY_OPERATOR',
	'BOOLEAN_LITERAL', // Example, true
	'BREAK', // break
	'CASE',
	'CATCH',
	'CLASS', // class
	'CLASS_BODY', // class A { }, the curly bracket section.
		// The curly bracket section in a class is given the type CLASS_BODY because it needs to be treated differently 
		// from most code blocks and object literals.
	'CODE_BLOCK', // For example, the {} in: function p() {}
	'COLON', // :
	'COMMA', // ,
	'CONDITIONAL_TERNARY', // Involves ? and :.
	'CONSTRUCTOR',
	'CONTINUE', // continue
	'CURLY_BRACKET_EXPRESSION', // {} that is not a code block
	'CURLY_LEFT_BRACKET', // {
	'CURLY_RIGHT_BRACKET', // }
	'CURVED_BRACKET_EXPRESSION', // For example, (1 + 3)

	'CURVED_LEFT_BRACKET', // (
	'CURVED_RIGHT_BRACKET', // )
	'DATA_TYPE', // int, float...
	'DECLARATION', // For example, int x
	'DEFAULT', // default used in switch
	// statements and export statements.
	'DO', // do
	'DOT', // .
	'ELSE', // else
	'ELSE_IF', // For example, else if (false) {}
	'EXPRESSION_DOT', // For example, (x).length
	'EXPRESSION_INDEX_EXPRESSION', // For example, f()[4]
	'EXTENDS', // class A extends B {
	'FINAL', // for example, final int x = 3;
	'FINALLY', // finally
	'FOR', // for (let i = 0; i < 10; i++) {}
	'FOR_LOOP_SETTINGS', // (let i = 0; i < 10; i++)
	'FOR_LOOP_INSTRUCTIONS', // the comma-separated instructions in some for-loop settings.
	// for (let i = 0; i < 10; i++,y+=4,)

	'GENERIC_LEFT_BRACKET',
	'GENERIC_RIGHT_BRACKET',
	'GENERIC_TYPE_EXPRESSION', // for example: the <Particle> in ArrayList<Particle> particle
	'IDENTIFIER', // for example: x123
	'IF',
	'IMPLEMENTS', // for example: class A implements B {
	'IMPORT',
	'INDEX_EXPRESSION', // x[3]
	'INTERFACE',
	'INTERFACE_BODY', // similar to CLASS_BODY but for interfaces
	'METHOD', // f() {...
	'METHOD_CALL', // A.f()
	'MULTI_LINE_COMMENT', // /* */
	'NEW', // new
	'NULL', // null
	'NUMBER_LITERAL', // Example, 123
	'QUESTION_MARK', // used in ternary operator 3 > x ? 1 : 2
	'RETURN',
	'SEMICOLON', // ;
	'SINGLE_LINE_COMMENT', // //
	'SQUARE_LEFT_BRACKET', // [
	'SQUARE_RIGHT_BRACKET', // ]
	'STATIC', // For example, class A {static a;}
	'STRING_LITERAL', // "hello world", 'hello world'
	'SWITCH', // switch
	'THIS',
	'THROW',
	'TREE_ROOT',
	'TRY', // try { } catch(e) {}
	'TYPE_CASTING',
	'UNRECOGNIZED',
	// Should be restricted to only erroneous, unrecognized tokens.  For example #
	'UNARY_OPERATOR',
	'VOID', // void
	'WHILE',
	'WILDCARD'
];

enumKeys.forEach(function(key, index) {
	ParseTreeTokenType[key] = index + 1;
});

const keys = Object.keys(ParseTreeTokenType).filter(key => Number.isInteger(ParseTreeTokenType[key]));
keys.forEach(function(key) {
	typeNames[ParseTreeTokenType[key]] = key;
});