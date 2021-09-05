import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseFork(logger) {
	const cases = [
		{
			'code': 'fork x',
			'treeInfo': {
				'children': [
					{'val': 'fork', 'type': ParseTreeTokenType.FORK, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					]}
				]
			}
		},
		{
			'code': 'fork x\nput "hi"',
			'treeInfo': {
				'children': [
					{'val': 'fork', 'type': ParseTreeTokenType.FORK, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					]},
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL}
				]
			}
		},
		{
			'code': 'fork greetings ( "Hi" )',
			'treeInfo': {
				'children': [
					{'val': 'fork', 'type': ParseTreeTokenType.FORK, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': 'greetings', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
								{'val': '(', 'children': []},
								{'val': '"Hi"', 'children': []},
								{'val': ')', 'children': []}
							]}
						]}
					]},
				]
			}
		}
	];
	processParseTestCases(cases, logger);
};