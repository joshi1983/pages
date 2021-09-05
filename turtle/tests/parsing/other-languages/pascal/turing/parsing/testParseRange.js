import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseRange(logger) {
	const cases = [
	{
		'code': '1..2',
		'treeInfo': {
			'children': [
				{'val': '..', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
					{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
					{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
				]}
			]
		}
	},{
		'code': 'x..y',
		'treeInfo': {
			'children': [
				{'val': '..', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		}
	},{
		'code': 'x..y by 2',
		'treeInfo': {
			'children': [
				{'val': 'by', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
					{'val': '..', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]},
					{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};