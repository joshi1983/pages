import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseListLiteral(logger) {
	const cases = [
	{
		'code': '[]',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.LIST_LITERAL,
				'children': [
					{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET, 'children': []},
					{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET, 'children': []}
				]
			}]
		}
	},
	{
		'code': '[3]',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.LIST_LITERAL,
				'children': [
					{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET, 'children': []},
					{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
					{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET, 'children': []}
				]
			}]
		}
	},
	{
		'code': '[3,x]',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.LIST_LITERAL,
				'children': [
					{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET, 'children': []},
					{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
					{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET, 'children': []}
				]
			}]
		}
	},
	{
		'code': '[3,f()]',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.LIST_LITERAL,
				'children': [
					{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET, 'children': []},
					{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
					{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
					{'val': 'f', 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
						{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
							{'val': '('},
							{'val': ')'}
						]}
					]},
					{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET, 'children': []}
				]
			}]
		}
	},{
		'code': '[x for x in fruits if "a" in x]',
		// list comprehension
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.LIST_LITERAL,
				'children': [
					{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET, 'children': []},
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': 'for', 'type': ParseTreeTokenType.FOR_LOOP, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': 'in'},
						{'val': 'fruits', 'type': ParseTreeTokenType.IDENTIFIER}
					]},
					{'val': 'if', 'type': ParseTreeTokenType.IF_STATEMENT},
					{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET, 'children': []},
				]}
			]
		}
	}
	];
	processParseTestCases(cases, logger);
};