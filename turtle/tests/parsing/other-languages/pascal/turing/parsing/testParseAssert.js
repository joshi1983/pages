import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseAssert(logger) {
	const cases = [
		{
			'code': 'assert x',
			'treeInfo': {
				'children': [
					{'val': 'assert', 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]}
				]
			}
		},
		{
			'code': 'assert x\nput "hi"',
			'treeInfo': {
				'children': [
					{'val': 'assert', 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL}
				]
			}
		},
		{
			'code': 'pre x',
			'treeInfo': {
				'children': [
					{'val': 'pre', 'type': ParseTreeTokenType.ASSERT, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]}
				]
			}
		},
		{
			'code': 'post x',
			'treeInfo': {
				'children': [
					{'val': 'post', 'type': ParseTreeTokenType.ASSERT, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]}
				]
			}
		},
		{
			'code': 'pre x\nput "hi"',
			'treeInfo': {
				'children': [
					{'val': 'pre', 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL}
				]
			}
		}
	];
	processParseTestCases(cases, logger);
};