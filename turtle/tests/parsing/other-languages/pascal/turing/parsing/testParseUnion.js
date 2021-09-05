import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseUnion(logger) {
	const cases = [
		{
			'code': 'union x',
			'treeInfo': {
				'children': [
					{'val': 'union', 'type': ParseTreeTokenType.UNION, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					]}
				]
			}
		},
		{
			'code': 'union x : y .. z',
			'treeInfo': {
				'children': [
					{'val': 'union', 'type': ParseTreeTokenType.UNION, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
						{'val': '..', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': 'y', 'children': []},
							{'val': 'z', 'children': []}
						]},
					]}
				]
			}
		},
		{
			'code': 'union x : y .. z of',
			'treeInfo': {
				'children': [
					{'val': 'union', 'type': ParseTreeTokenType.UNION, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
						{'val': '..', 'type': ParseTreeTokenType.BINARY_OPERATOR},
						{'val': 'of', 'type': ParseTreeTokenType.OF, 'children': []}
					]}
				]
			}
		},
	];
	processParseTestCases(cases, logger);
};