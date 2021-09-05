import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseBinaryOperators(logger) {
	const cases = [
	{
		'code': 'return f() /',
		'treeInfo': {
			'children': [
				{'val': 'return', 'type': ParseTreeTokenType.RETURN, 'children': [
					{'val': '/', 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': 'f', 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
								{'val': '(', 'children': []},
								{'val': ')', 'children': []}
							]}
						]}
					]}
				]}
			]
			
		}
	},
	{
		'code': 'return float64() / (3)',
		'treeInfo': {
			'children': [
				{'val': 'return', 'type': ParseTreeTokenType.RETURN, 'children': [
					{'val': '/', 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': 'float64', 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
								{'val': '(', 'children': []},
								{'val': ')', 'children': []}
							]}
						]},
						{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
							{'val': '(', 'children': []},
							{'val': '3', 'children': []},
							{'val': ')', 'children': []}
						]}
					]}
				]}
			]
			
		}
	},
	{'code': '-x+3',
		'treeInfo': {
			'children': [
				{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
					{'val': '-', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]},
					{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
				]}
			]
		}
	},
	{'code': '-(x)+3',
		'treeInfo': {
			'children': [
				{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
					{'val': '-', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
						{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
							{'val': '(', 'children': []},
							{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': ')', 'children': []}
						]}
					]},
					{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
				]}
			]
		}
	},
	{'code': '<-x+3',
		'treeInfo': {
			'children': [
				{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
					{'val': '<-', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]},
					{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
				]}
			]
		}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};