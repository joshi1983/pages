import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseLoop(logger) {
	const cases = [
	{
		'code': 'loop',
		'treeInfo': {
			'children': [
				{'val': 'loop', 'type': ParseTreeTokenType.LOOP, 'children': []},
			]
		}
	},{
		'code': 'loop\nf()',
		'treeInfo': {
			'children': [
				{'val': 'loop', 'type': ParseTreeTokenType.LOOP, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': 'f', 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
								{'val': '(', 'children': []},
								{'val': ')', 'children': []}
							]}
						]}
					]},
				]},
			]
		}
	},{
		'code': 'loop\nend loop',
		'treeInfo': {
			'children': [
				{'val': 'loop', 'type': ParseTreeTokenType.LOOP, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.END_LOOP, 'children': [
						{'val': 'end', 'children': []},
						{'val': 'loop', 'type': ParseTreeTokenType.LOOP, 'children': []}
					]},
				]},
			]
		}
	},{
		'code': 'loop\nf()\nend loop',
		'treeInfo': {
			'children': [
				{'val': 'loop', 'type': ParseTreeTokenType.LOOP, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': 'f', 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
								{'val': '(', 'children': []},
								{'val': ')', 'children': []}
							]}
						]}
					]},
					{'val': null, 'type': ParseTreeTokenType.END_LOOP, 'children': [
						{'val': 'end', 'children': []},
						{'val': 'loop', 'type': ParseTreeTokenType.LOOP, 'children': []}
					]},
				]},
			]
		}
	},{
		'code': 'loop\nf()\nend loop\nput "hi"',
		'treeInfo': {
			'children': [
				{'val': 'loop', 'type': ParseTreeTokenType.LOOP},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'put', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};