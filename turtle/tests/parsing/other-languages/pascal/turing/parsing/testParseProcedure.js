import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseProcedure(logger) {
	const cases = [
	{
		'code': 'procedure p',
		'treeInfo': {
			'children': [
				{'val': 'procedure', 'type': ParseTreeTokenType.PROCEDURE, 'children': [
					{'val': 'p', 'children': []},
				]}
			]
		}
	},{
		'code': 'procedure p(',
		'treeInfo': {
			'children': [
				{'val': 'procedure', 'type': ParseTreeTokenType.PROCEDURE, 'children': [
					{'val': 'p', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.FORMAL_ARG_LIST, 'children': [
						{'val': '(', 'children': []}
					]},
				]}
			]
		}
	},{
		'code': 'procedure p()',
		'treeInfo': {
			'children': [
				{'val': 'procedure', 'type': ParseTreeTokenType.PROCEDURE, 'children': [
					{'val': 'p', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.FORMAL_ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': ')', 'children': []}
					]},
				]}
			]
		}
	},{
		'code': 'procedure p()\nend p',
		'treeInfo': {
			'children': [
				{'val': 'procedure', 'type': ParseTreeTokenType.PROCEDURE, 'children': [
					{'val': 'p', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.FORMAL_ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': ')', 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.END_PROCEDURE, 'children': [
						{'val': 'end', 'children': []},
						{'val': 'p', 'children': []}
					]},
				]}
			]
		}
	},{
		'code': 'procedure p()\nend p\nput "hi"',
		'treeInfo': {
			'children': [
				{'val': 'procedure', 'type': ParseTreeTokenType.PROCEDURE, 'children': [
					{'val': 'p', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.FORMAL_ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': ')', 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.END_PROCEDURE, 'children': [
						{'val': 'end', 'children': []},
						{'val': 'p', 'children': []}
					]},
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
		'code': 'procedure p()\npre x\nend p',
		'treeInfo': {
			'children': [
				{'val': 'procedure', 'type': ParseTreeTokenType.PROCEDURE, 'children': [
					{'val': 'p', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.FORMAL_ARG_LIST},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'pre', 'children': [
							{'val': 'x', 'children': []}
						]}
					]},
					{'val': null, 'type': ParseTreeTokenType.END_PROCEDURE},
				]}
			]
		}
	},{
		'code': 'procedure p()\npost x\nend p',
		'treeInfo': {
			'children': [
				{'val': 'procedure', 'type': ParseTreeTokenType.PROCEDURE, 'children': [
					{'val': 'p', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.FORMAL_ARG_LIST},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'post', 'children': [
							{'val': 'x', 'children': []}
						]}
					]},
					{'val': null, 'type': ParseTreeTokenType.END_PROCEDURE},
				]}
			]
		}
	},{
		'code': 'deferred procedure p()\nput "hi"',
		'treeInfo': {
			'children': [
				{'val': 'deferred', 'type': ParseTreeTokenType.DEFERRED, 'children': [
					{'val': 'procedure', 'type': ParseTreeTokenType.PROCEDURE, 'children': [
						{'val': 'p', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.FORMAL_ARG_LIST, 'children': [
							{'val': '(', 'children': []},
							{'val': ')', 'children': []}
						]},
					]},
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
		'code': 'body procedure p\nend p\nput "hi"',
		'treeInfo': {
			'children': [
				{'val': 'body', 'type': ParseTreeTokenType.BODY, 'children': [
					{'val': 'procedure', 'type': ParseTreeTokenType.PROCEDURE, 'children': [
						{'val': 'p', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.END_PROCEDURE, 'children': [
							{'val': 'end', 'children': []},
							{'val': 'p', 'children': []}
						]},
					]},
				]},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'put', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '"hi"', 'children': []}
					]}
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};