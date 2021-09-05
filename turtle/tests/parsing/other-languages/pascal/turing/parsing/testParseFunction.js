import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseFunction(logger) {
	const cases = [
	{
		'code': 'function f',
		'treeInfo': {
			'children': [
				{'val': 'function', 'type': ParseTreeTokenType.FUNCTION, 'children': [
					{'val': 'f', 'children': []},
				]}
			]
		}
	},{
		'code': 'function f(',
		'treeInfo': {
			'children': [
				{'val': 'function', 'type': ParseTreeTokenType.FUNCTION, 'children': [
					{'val': 'f', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.FORMAL_ARG_LIST, 'children': [
						{'val': '(', 'children': []}
					]},
				]}
			]
		}
	},{
		'code': 'function f()',
		'treeInfo': {
			'children': [
				{'val': 'function', 'type': ParseTreeTokenType.FUNCTION, 'children': [
					{'val': 'f', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.FORMAL_ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': ')', 'children': []}
					]},
				]}
			]
		}
	},{
		'code': 'function f()\nend f',
		'treeInfo': {
			'children': [
				{'val': 'function', 'type': ParseTreeTokenType.FUNCTION, 'children': [
					{'val': 'f', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.FORMAL_ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': ')', 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.END_FUNCTION, 'children': [
						{'val': 'end', 'children': []},
						{'val': 'f', 'children': []}
					]}
				]}
			]
		}
	},{
		'code': 'function f()\nend f\nput "hi"',
		'treeInfo': {
			'children': [
				{'val': 'function', 'type': ParseTreeTokenType.FUNCTION, 'children': [
					{'val': 'f', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.FORMAL_ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': ')', 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.END_FUNCTION, 'children': [
						{'val': 'end', 'children': []},
						{'val': 'f', 'children': []}
					]}
				]},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'put', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '"hi"', 'children': []}
					]}
				]}
			]
		}
	},{
		'code': 'function f():real\nend f',
		'treeInfo': {
			'children': [
				{'val': 'function', 'type': ParseTreeTokenType.FUNCTION, 'children': [
					{'val': 'f', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.FORMAL_ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': ')', 'children': []}
					]},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
						{'val': 'real', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.END_FUNCTION, 'children': [
						{'val': 'end', 'children': []},
						{'val': 'f', 'children': []}
					]}
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};