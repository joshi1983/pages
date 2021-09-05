import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseTupleLiteral(logger) {
	const cases = [
	{
		'code': '()',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.TUPLE_LITERAL,
				'children': [
					{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET, 'children': []},
					{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET, 'children': []}
				]
			}]
		}
	},
	{
		'code': '(3,)',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.TUPLE_LITERAL,
				'children': [
					{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET, 'children': []},
					{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
					{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
					{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET, 'children': []}
				]
			}]
		}
	},
	{
		'code': '(3,x)',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.TUPLE_LITERAL,
				'children': [
					{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET, 'children': []},
					{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
					{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET, 'children': []}
				]
			}]
		}
	},
	{
		'code': '(3,f())',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.TUPLE_LITERAL,
				'children': [
					{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET, 'children': []},
					{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
					{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
					{'val': 'f', 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
						{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
							{'val': '('},
							{'val': ')'}
						]}
					]},
					{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET, 'children': []}
				]
			}]
		}
	},
	{
		'code': 'x=()',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
					{'val': 'x', 'children': []},
					{
					'val': null,
					'type': ParseTreeTokenType.TUPLE_LITERAL,
					'children': [
						{'val': '(', 'children': []},
						{'val': ')', 'children': []}
					]
					}
				]
				}
			]
		}
	},
	];
	processParseTestCases(cases, logger);
};