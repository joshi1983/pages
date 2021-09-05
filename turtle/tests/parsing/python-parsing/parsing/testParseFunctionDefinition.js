import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

/*
There is a little overlap between "function definitions" and "decorators".
See testParseDecorator for test cases specific to decorator function definitions and their references.
*/
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
	},{
		'code': `def fun(max):
    cnt = 1
    while cnt <= max:
        yield cnt
        cnt += 1`,
		'numTopChildren': 1,
		'treeInfo':  {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.FUNCTION_DEFINITION,
				'children': [
					{'val': 'def', 'type': ParseTreeTokenType.DEF, 'children': []},
					{'val': 'fun', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
						{'val': '('},
						{'val': 'max'},
						{'val': ')'},
					]},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
							{'val': 'cnt', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
						]},
						{'val': 'while', 'type': ParseTreeTokenType.WHILE_LOOP, 'children': [
							{'val': '<=', 'type': ParseTreeTokenType.BINARY_OPERATOR},
							{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
							{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
								{'val': 'yield', 'type': ParseTreeTokenType.YIELD, 'children': [
									{'val': 'cnt', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
								]},
								{'val': '+=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
									{'val': 'cnt', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
									{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
								]}
							]}
						]}
					]},
				]
			}]
		}
	},{
		'code': 'def shape():\n\tpass',
		'numTopChildren': 1,
		'treeInfo':  {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.FUNCTION_DEFINITION,
				'children': [
					{'val': 'def', 'type': ParseTreeTokenType.DEF, 'children': []},
					{'val': 'shape', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
						{'val': '('},
						{'val': ')'},
					]},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'pass', 'type': ParseTreeTokenType.PASS, 'children': []}
					]}
				]
				}
			]
		}
	},{
		'code': `def f():
	return

f()`,
		'numTopChildren': 2,
		'treeInfo':  {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.FUNCTION_DEFINITION,
				'children': [
					{'val': 'def', 'type': ParseTreeTokenType.DEF, 'children': []},
					{'val': 'f', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST},
					{'val': ':', 'children': []},
					{'val': null, 'children': [
						{'val': 'return', 'children': []}
					]},
				]},
				{'val': 'f', 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST}
				]}
			]
		}
	}
	];
	processParseTestCases(cases, logger);
};