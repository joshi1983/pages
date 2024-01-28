const typeNames = [];

export class ParseTreeTokenType {

	static getNameFor(typeInteger) {
		return typeNames[typeInteger];
	}
};

const enumKeys = [
	'ARG_LIST', // for example (1, 3, 4)
	'ARRAY_LITERAL', // for example [1, 3, 4]
	'ASSIGNMENT_OPERATOR', // =, +=, -=...
	// An assignment operator is a kind of binary operator that assigns a value to a variable or property.
	'ASYNC', // async
	'AWAIT', // await

	'BINARY_OPERATOR',
	'BOOLEAN_LITERAL', // Example, true
	'BREAK', // break
	'CASE', // case used in switch statements
	'CATCH', // catch
	'CLASS', // class
	'CLASS_BODY', // class A { }, the curly bracket section.
		// The curly bracket section in a class is given the type CLASS_BODY because it needs to be treated differently 
		// from most code blocks and object literals.
	'CODE_BLOCK', // For example, the {} in: function p() {}
	'COLON', // :
	'COMMA', // ,
	'CONDITIONAL_TERNARY', // Involves ? and :.  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator
	'CONST',
	'CONTINUE', // continue
	'CURLY_BRACKET_EXPRESSION', // {} that is not a code block
	'CURLY_LEFT_BRACKET', // {
	'CURLY_RIGHT_BRACKET', // }
	'CURVED_BRACKET_EXPRESSION', // For example, (1 + 3)

	'CURVED_LEFT_BRACKET', // (
	'CURVED_RIGHT_BRACKET', // )
	'DEBUGGER', // debugger
	'DEFAULT', // default used in switch statements
	'DELETE', // delete
	'DO', // do
	'DOT', // .
	'ELSE', // else
	'ELSE_IF', // For example, else if (false) {}
	'EXPORT', // export
	'EXPRESSION_DOT', // For example, (x).length
	'EXPRESSION_INDEX_EXPRESSION', // For example, f()[4]
	'EXTENDS', // class A extends B {
	'FINALLY', // finally
	'FOR', // for (let i = 0; i < 10; i++) {}
	'FOR_LOOP_SETTINGS', // (let i = 0; i < 10; i++)
	'FROM', // For example, import { P } from './P.js';
	'FUNCTION', // function
	'FUNCTION_CALL', // f()
	'GENERATOR_STAR', // for example: function* f() {}
	'IDENTIFIER', // for example: x123
	'IF',
	'IMPORT', // for example: import { P } from './P.js';
	'IN',
	'INDEX_EXPRESSION', // x[3]
	'INTERFACE',
	'LET', // let
	'MULTI_LINE_COMMENT', // /* */
	'NEW', // new
	'NULL', // null
	'NUMBER_LITERAL', // Example, 123
	'OF', // For example, for (const key of this.readAgeMap) {}
	'QUESTION_MARK', // ?
	'REGULAR_EXPRESSION_LITERAL', // /\s+/g
	'RETURN',
	'SEMICOLON', // ;
	'SINGLE_LINE_COMMENT', // //
	'SQUARE_LEFT_BRACKET', // [
	'SQUARE_RIGHT_BRACKET', // ]
	'STATIC', // For example, class A {static a;}
	'STRING_LITERAL', // "hello world", 'hello world'
	'TEMPLATE_LITERAL', // `hello world`
	'SWITCH', // switch
	'THIS',
	'THROW',
	'TREE_ROOT',
	'TRY', // try { } catch(e) {}
	'UNDEFINED', // undefined
	'UNRECOGNIZED',
	// Should be restricted to only erroneous, unrecognized tokens.  For example #
	'UNARY_OPERATOR',
	'VAR',
	'WHILE',
	'WITH'
];

enumKeys.forEach(function(key, index) {
	ParseTreeTokenType[key] = index + 1;
});

const keys = Object.keys(ParseTreeTokenType).filter(key => Number.isInteger(ParseTreeTokenType[key]));
keys.forEach(function(key) {
	typeNames[ParseTreeTokenType[key]] = key;
});