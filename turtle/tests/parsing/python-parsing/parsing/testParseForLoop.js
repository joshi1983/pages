import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseForLoop(logger) {
	const cases = [
	{
		'code': 'for _ in range(4)',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'for',
				'type': ParseTreeTokenType.FOR_LOOP,
				'children': [
					{'val': '_', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': 'in', 'type': ParseTreeTokenType.IN, 'children': []},
					{'val': 'range', 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
						{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
							{'val': '('},
							{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL},
							{'val': ')'}
						]}
					]},
				]
			}]
		}
	},
	{
		'code': 'for _ in range(4):\n\tbreak',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'for',
				'type': ParseTreeTokenType.FOR_LOOP,
				'children': [
					{'val': '_', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': 'in', 'type': ParseTreeTokenType.IN, 'children': []},
					{'val': 'range', 'type': ParseTreeTokenType.FUNCTION_CALL},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'break', 'type': ParseTreeTokenType.BREAK, 'children': []}
					]}
				]
			}]
		}
	},
	{
		'code': 'for _ in range(4):\n\tprint(_)\n\nprint("after loop and printing 1 time")',
		'numTopChildren': 2,
		'treeInfo': {
			'children': [{
				'val': 'for',
				'type': ParseTreeTokenType.FOR_LOOP,
				'children': [
					{'val': '_', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': 'in', 'type': ParseTreeTokenType.IN, 'children': []},
					{'val': 'range', 'type': ParseTreeTokenType.FUNCTION_CALL},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'print', 'type': ParseTreeTokenType.FUNCTION_CALL}
					]}
				]},
				{'val': 'print', 'type': ParseTreeTokenType.FUNCTION_CALL}
			]
		}
	},{
		'code': `for x in range(6):
    print(x)
else:
    print("Finally finished!")`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'for',
				'type': ParseTreeTokenType.FOR_LOOP,
				'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': 'in', 'type': ParseTreeTokenType.IN, 'children': []},
					{'val': 'range', 'type': ParseTreeTokenType.FUNCTION_CALL},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'print', 'type': ParseTreeTokenType.FUNCTION_CALL}
					]},
					{'val': 'else', 'children': [
						{'val': ':'},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
							{'val': 'print', 'type': ParseTreeTokenType.FUNCTION_CALL}
						]}
					]}
				]}
			]
		}
	},{
		'code': "for colours in ['x','y']:",
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'for',
				'type': ParseTreeTokenType.FOR_LOOP,
				'children': [
					{'val': 'colours', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': 'in', 'type': ParseTreeTokenType.IN, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.LIST_LITERAL},
					{'val': ':'},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
				]}
			]
		}
	},{
		'code': 'for index, i in enumerate(t):',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'for',
				'type': ParseTreeTokenType.FOR_LOOP,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.COMMA_EXPRESSION, 'children': [
						{'val': 'index', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
						{'val': 'i', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]},
					{'val': 'in', 'type': ParseTreeTokenType.IN, 'children': []},
					{'val': 'enumerate', 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
						{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
							{'val': '(', 'children': []},
							{'val': 't', 'children': []},
							{'val': ')', 'children': []}
						]}
					]},
					{'val': ':'},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};
