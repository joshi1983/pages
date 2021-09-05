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
	}];
	processParseTestCases(cases, logger);
};