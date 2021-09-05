import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseFor(logger) {
	const cases = [
	{
		'code': 'for x',
		'treeInfo': {
			'children': [
				{'val': 'for', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'x', 'children': []},
					]},
			]
		}
	},{
		'code': 'for x: 3',
		'treeInfo': {
			'children': [
				{'val': 'for', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
				]},
			]
		}
	},{
		'code': 'for x: 3..10',
		'treeInfo': {
			'children': [
				{'val': 'for', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': '..', 'type': ParseTreeTokenType.BINARY_OPERATOR,
					'children': [
						{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
						{'val': '10', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]}
				]},
			]
		}
	},{
		'code': 'for x: 3..10\nend',
		'treeInfo': {
			'children': [
				{'val': 'for', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': '..', 'type': ParseTreeTokenType.BINARY_OPERATOR,
					'children': [
						{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
						{'val': '10', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.END_FOR, 'children': [
						{'val': 'end', 'type': ParseTreeTokenType.END, 'children': []}
					]}
				]},
			]
		}
	},{
		'code': 'for x: 3..10 by 2\nend for',
		'treeInfo': {
			'children': [
				{'val': 'for', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': 'by', 'type': ParseTreeTokenType.BINARY_OPERATOR,
					'children': [
						{'val': '..', 'type': ParseTreeTokenType.BINARY_OPERATOR,
						'children': [
							{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
							{'val': '10', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
						]},
						{'val': '2'}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.END_FOR, 'children': [
						{'val': 'end', 'type': ParseTreeTokenType.END, 'children': []},
						{'val': 'for', 'type': ParseTreeTokenType.FOR, 'children': []}
					]}
				]},
			]
		}
	},{
		'code': 'for x: 3..10\nend for\nput "hi"',
		'treeInfo': {
			'children': [
				{'val': 'for', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': '..', 'type': ParseTreeTokenType.BINARY_OPERATOR,
					'children': [
						{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
						{'val': '10', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.END_FOR, 'children': [
						{'val': 'end', 'type': ParseTreeTokenType.END, 'children': []},
						{'val': 'for', 'type': ParseTreeTokenType.FOR, 'children': []}
					]}
				]},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'put', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
				]}
			]
		}
	},
	{
		// an example from https://compsci.ca/v3/viewtopic.php?t=3678
		'code': 'for decreasing counter : 10 .. 1',
		'treeInfo': {
			'children': [
				{'val': 'for', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'decreasing', 'type': ParseTreeTokenType.DECREASING, 'children': []},
					{'val': 'counter', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': '..', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': '10', 'children': []},
						{'val': '1', 'children': []}
					]},
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};