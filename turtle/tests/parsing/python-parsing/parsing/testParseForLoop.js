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
						{'val': 'print', 'type': ParseTreeTokenType.FUNCTION_CALL}
					]}
			]},
			{'val': 'print', 'type': ParseTreeTokenType.FUNCTION_CALL}
			]
		}
	}];
	processParseTestCases(cases, logger);
};
