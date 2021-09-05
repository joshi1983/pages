import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseBinaryOperator(logger) {
	const cases = [
	{
		'code': 'x+y',
		'treeInfo': {
			'children': [
				{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		}
	},
	{
		'code': 'x=>y',
		'treeInfo': {
			'children': [
				{'val': '=>', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		}
	},
	{
		'code': 'x not in y',
		'treeInfo': {
			'children': [
				{'val': 'not in', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};