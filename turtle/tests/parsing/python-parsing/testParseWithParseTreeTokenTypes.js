import { getAllDescendentsAsArray } from '../../../modules/parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { parse } from '../../../modules/parsing/python-parsing/parsing/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

export async function testParseWithParseTreeTokenTypes(logger) {
	const cases = [
		{'code': 'import turtle', 'types': [
			ParseTreeTokenType.IMPORT,
			ParseTreeTokenType.IDENTIFIER
		], 'vals': [
			'turtle'
		], 'unexpectedVals': []
		},
		{'code': 'fd(40)', 'types': [
			ParseTreeTokenType.CURVED_LEFT_BRACKET,
			ParseTreeTokenType.CURVED_RIGHT_BRACKET,
			ParseTreeTokenType.FUNCTION_CALL,
			ParseTreeTokenType.NUMBER_LITERAL
		], 'vals': [
			'fd', '(', '40', ')'
		], 'unexpectedVals': []
		},
		{
			'code': 'print True', 'types': [
				ParseTreeTokenType.FUNCTION_CALL,
				ParseTreeTokenType.BOOLEAN_LITERAL
			], 'vals': [
				'True'
			], 'unexpectedVals': []
		},
		{
			'code': '3-x', 'types': [
				ParseTreeTokenType.NUMBER_LITERAL,
				ParseTreeTokenType.BINARY_OPERATOR,
				ParseTreeTokenType.IDENTIFIER
			], 'vals': [
				'3', '-', 'x'
			], 'unexpectedVals': []
		},
		{
			'code': '3%x', 'types': [
				ParseTreeTokenType.NUMBER_LITERAL,
				ParseTreeTokenType.BINARY_OPERATOR,
				ParseTreeTokenType.IDENTIFIER
			], 'vals': [
				'3', '%', 'x'
			], 'unexpectedVals': []
		},
		{
			'code': 'print "hi"\nprint "yo"', 'types': [
				ParseTreeTokenType.FUNCTION_CALL,
				ParseTreeTokenType.STRING_LITERAL
			], 'vals': [
				'"yo"', '"hi"'
			], 'unexpectedVals': []
		},
		{
			'code': 'def f():\n\treturn 0', 'types': [
				ParseTreeTokenType.DEF,
				ParseTreeTokenType.IDENTIFIER,
				ParseTreeTokenType.FUNCTION_DEFINITION,
				ParseTreeTokenType.RETURN,
				ParseTreeTokenType.NUMBER_LITERAL
			], 'vals': [
				'f', '0'
			], 'unexpectedVals': []
		},
		{
			'code': 'turtle.done()', 'types': [
				ParseTreeTokenType.IDENTIFIER,
				ParseTreeTokenType.DOT,
				ParseTreeTokenType.FUNCTION_CALL,
				ParseTreeTokenType.CURVED_LEFT_BRACKET,
				ParseTreeTokenType.CURVED_RIGHT_BRACKET,
			],
			'vals': ['turtle', '.', 'done', '(', ')'],
			'unexpectedVals': []
		},
		{
			'code': 'x = 3', 'types': [
				ParseTreeTokenType.IDENTIFIER,
				ParseTreeTokenType.ASSIGNMENT_OPERATOR,
				ParseTreeTokenType.NUMBER_LITERAL,
			],
			'vals': ['x', '=', '3'],
			'unexpectedVals': []
		},
		{
			'code': 'x += 3', 'types': [
				ParseTreeTokenType.IDENTIFIER,
				ParseTreeTokenType.ASSIGNMENT_OPERATOR,
				ParseTreeTokenType.NUMBER_LITERAL,
			],
			'vals': ['x', '+=', '3'],
			'unexpectedVals': []
		},
		{
			'code': 'None', 'types': [
				ParseTreeTokenType.NONE
			],
			'vals': [],
			'unexpectedVals': []
		},
		{
			'code': '[]', 'types': [
				ParseTreeTokenType.LIST_LITERAL,
				ParseTreeTokenType.SQUARE_LEFT_BRACKET,
				ParseTreeTokenType.SQUARE_RIGHT_BRACKET
			],
			'vals': [],
			'unexpectedVals': []
		},
		{
			'code': '[1,2]', 'types': [
				ParseTreeTokenType.LIST_LITERAL,
				ParseTreeTokenType.SQUARE_LEFT_BRACKET,
				ParseTreeTokenType.NUMBER_LITERAL,
				ParseTreeTokenType.SQUARE_RIGHT_BRACKET
			],
			'vals': [],
			'unexpectedVals': []
		},
		{
			'code': '()', 'types': [
				ParseTreeTokenType.TUPLE_LITERAL,
				ParseTreeTokenType.CURVED_LEFT_BRACKET,
				ParseTreeTokenType.CURVED_RIGHT_BRACKET
			],
			'vals': [],
			'unexpectedVals': []
		},
		{
			'code': '([])', 'types': [
				ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
				ParseTreeTokenType.CURVED_LEFT_BRACKET,
				ParseTreeTokenType.SQUARE_LEFT_BRACKET,
				ParseTreeTokenType.LIST_LITERAL,
				ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
				ParseTreeTokenType.CURVED_RIGHT_BRACKET
			],
			'vals': [],
			'unexpectedVals': []
		},
		{
			'code': 'print [1,2]', 'types': [
				ParseTreeTokenType.FUNCTION_CALL,
				ParseTreeTokenType.LIST_LITERAL,
				ParseTreeTokenType.SQUARE_LEFT_BRACKET,
				ParseTreeTokenType.NUMBER_LITERAL,
				ParseTreeTokenType.SQUARE_RIGHT_BRACKET
			],
			'vals': [],
			'unexpectedVals': []
		},
		{
			'code': 'x = ()', 'types': [
				ParseTreeTokenType.IDENTIFIER,
				ParseTreeTokenType.TUPLE_LITERAL
			],
			'vals': ['x', '=', '(', ')'],
			'unexpectedVals': []
		},
		{
			'code': 'print( () )', 'types': [
				ParseTreeTokenType.FUNCTION_CALL,
				ParseTreeTokenType.TUPLE_LITERAL
			],
			'vals': [],
			'unexpectedVals': []
		},
		{
			'code': '3 in [1,2,3]', 'types': [
				ParseTreeTokenType.NUMBER_LITERAL,
				ParseTreeTokenType.BINARY_OPERATOR,
				ParseTreeTokenType.LIST_LITERAL
			],
			'vals': [],
			'unexpectedVals': []
		},
		{
			'code': 'for i in range(2):\n\tpass', 'types': [
				ParseTreeTokenType.FOR_LOOP,
				ParseTreeTokenType.IDENTIFIER,
				ParseTreeTokenType.IN,
				ParseTreeTokenType.FUNCTION_CALL,
				ParseTreeTokenType.CURVED_LEFT_BRACKET,
				ParseTreeTokenType.NUMBER_LITERAL,
				ParseTreeTokenType.CURVED_RIGHT_BRACKET,
				ParseTreeTokenType.COLON,
				ParseTreeTokenType.PASS
			],
			'vals': [],
			'unexpectedVals': []
		},
		{
			'code': 'while True:\n\tprint "hi"',
			'types': [
				ParseTreeTokenType.WHILE_LOOP,
				ParseTreeTokenType.BOOLEAN_LITERAL,
				ParseTreeTokenType.COLON,
				ParseTreeTokenType.FUNCTION_CALL,
				ParseTreeTokenType.STRING_LITERAL
			],
			'vals': [],
			'unexpectedVals': []
		},
		{
			'code': 'def f():\n\treturn',
			'types': [
				ParseTreeTokenType.DEF,
				ParseTreeTokenType.IDENTIFIER,
				ParseTreeTokenType.CURVED_LEFT_BRACKET,
				ParseTreeTokenType.CURVED_RIGHT_BRACKET,
				ParseTreeTokenType.COLON,
				ParseTreeTokenType.RETURN
			],
			'vals': [],
			'unexpectedVals': ['n', 'eturn']
		},
		{
			'code': 'def f():\n\tpass',
			'types': [
				ParseTreeTokenType.DEF,
				ParseTreeTokenType.IDENTIFIER,
				ParseTreeTokenType.CURVED_LEFT_BRACKET,
				ParseTreeTokenType.CURVED_RIGHT_BRACKET,
				ParseTreeTokenType.COLON,
				ParseTreeTokenType.PASS
			],
			'vals': [],
			'unexpectedVals': ['n', 'eturn']
		},
		{
			'code': 'if True:\n\tprint("hi")',
			'types': [
				ParseTreeTokenType.IF_STATEMENT,
				ParseTreeTokenType.BOOLEAN_LITERAL,
				ParseTreeTokenType.COLON,
				ParseTreeTokenType.CURVED_LEFT_BRACKET,
				ParseTreeTokenType.STRING_LITERAL,
				ParseTreeTokenType.CURVED_RIGHT_BRACKET,
			],
			'vals': [],
			'unexpectedVals': []
		},
		{
			'code': 'if True:\n    print("hi")',
			'types': [
				ParseTreeTokenType.IF_STATEMENT,
				ParseTreeTokenType.BOOLEAN_LITERAL,
				ParseTreeTokenType.COLON,
				ParseTreeTokenType.CURVED_LEFT_BRACKET,
				ParseTreeTokenType.STRING_LITERAL,
				ParseTreeTokenType.CURVED_RIGHT_BRACKET,
			],
			'vals': [],
			'unexpectedVals': []
		},
		{
			'code': 'def f():\n\tglobal x',
			'types': [
				ParseTreeTokenType.DEF,
				ParseTreeTokenType.FUNCTION_DEFINITION,
				ParseTreeTokenType.CURVED_LEFT_BRACKET,
				ParseTreeTokenType.CURVED_RIGHT_BRACKET,
				ParseTreeTokenType.COLON,
				ParseTreeTokenType.GLOBAL,
				ParseTreeTokenType.IDENTIFIER
			],
			'vals': ['f', '(', ')', 'x'],
			'unexpectedVals': []
		},
		{
			'code': 'def f():\n\t"""docstring here"""\n\tpass',
			'types': [
				ParseTreeTokenType.DEF,
				ParseTreeTokenType.FUNCTION_DEFINITION,
				ParseTreeTokenType.CURVED_LEFT_BRACKET,
				ParseTreeTokenType.CURVED_RIGHT_BRACKET,
				ParseTreeTokenType.COLON,
				ParseTreeTokenType.DOCSTRING,
				ParseTreeTokenType.PASS
			],
			'vals': ['f', '(', ')'],
			'unexpectedVals': []
		},
		{
			'code': 'def f():\n\t\'\'\'docstring here\'\'\'\n\tpass',
			'types': [
				ParseTreeTokenType.DEF,
				ParseTreeTokenType.FUNCTION_DEFINITION,
				ParseTreeTokenType.CURVED_LEFT_BRACKET,
				ParseTreeTokenType.CURVED_RIGHT_BRACKET,
				ParseTreeTokenType.COLON,
				ParseTreeTokenType.DOCSTRING,
				ParseTreeTokenType.PASS
			],
			'vals': ['f', '(', ')'],
			'unexpectedVals': []
		},
		{
			'code': 'print(*[1])',
			'types': [
				ParseTreeTokenType.CURVED_LEFT_BRACKET,
				ParseTreeTokenType.CURVED_RIGHT_BRACKET,
				ParseTreeTokenType.LIST_LITERAL,
				ParseTreeTokenType.NUMBER_LITERAL,
				ParseTreeTokenType.UNARY_OPERATOR
			],
			'vals': ['print', '(', '*', '[', '1', ']', ')'],
			'unexpectedVals': []
		},
		{
			'code': 'fast_draw = False\ncountry_names = {}',
			'types': [
				ParseTreeTokenType.ASSIGNMENT_OPERATOR,
				ParseTreeTokenType.BOOLEAN_LITERAL,
				ParseTreeTokenType.CURLY_LEFT_BRACKET,
				ParseTreeTokenType.CURLY_RIGHT_BRACKET,
				ParseTreeTokenType.DICTIONARY_LITERAL,
				ParseTreeTokenType.IDENTIFIER
			],
			'vals': ['fast_draw', '=', 'False', 'country_names', '{', '}'],
			'unexpectedVals': []
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const tree = parseResult.root;
		if (tree === undefined) {
			plogger('Expected to get a parse tree but got undefined instead.');
			return;
		}
		const allTokens = getAllDescendentsAsArray(tree);
		caseInfo.types.forEach(function(type) {
			const matches = allTokens.filter(token => token.type === type);
			if (matches.length === 0)
				plogger(`Expected to find a token of type ${ParseTreeTokenType.getNameFor(type)} but none were found.`);
		});
		caseInfo.vals.forEach(function(val) {
			const matches = allTokens.filter(token => token.val === val);
			if (matches.length === 0)
				plogger(`Expected to find a token with val ${val} but none were found.`);
		});
		caseInfo.unexpectedVals.forEach(function(unexpectedVal) {
			const matches = allTokens.filter(token => token.val === unexpectedVal);
			if (matches.length !== 0)
				plogger(`Expected not to find a token with val ${unexpectedVal} but found it ${matches.length} times.`);
		});
	});
};