import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseFunctionDefinition(logger) {
	const cases = [
	{
		'code': 'def f(b):\n\treturn 4',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.FUNCTION_DEFINITION,
				'children': [
					{'val': 'def'},
					{'val': 'f'},
					{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
						{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
						{'val': 'b', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
					]},
					{'val': ':'},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'return', 'type': ParseTreeTokenType.RETURN, 'children': [
							{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]}
					]},
				]
			}
		]}
	},
	{
		'code': 'def f(b):\n\tprint "hello"\n\treturn 4',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.FUNCTION_DEFINITION,
				'children': [
					{'val': 'def'},
					{'val': 'f'},
					{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
						{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
						{'val': 'b', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
					]},
					{'val': ':'},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'print', 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
								{'val': '"hello"', 'type': ParseTreeTokenType.STRING_LITERAL}
							]}
						]},
						{'val': 'return', 'type': ParseTreeTokenType.RETURN, 'children': [
							{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]}
					]},
				]
			}
		]}
	},{
		'code': 'async def func():\n\tprint("Hello!")',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.FUNCTION_DEFINITION,
				'children': [
					{'val': 'async', 'type': ParseTreeTokenType.ASYNC, 'children': []},
					{'val': 'def', 'type': ParseTreeTokenType.DEF, 'children': []},
					{'val': 'func', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
						{'val': '('},
						{'val': ')'},
					]},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'print', 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
								{'val': '('},
								{'val': '"Hello!"'},
								{'val': ')'}
							]}
						]}
					]},
				]
			}]
		}
	}
	];
	processParseTestCases(cases, logger);
};