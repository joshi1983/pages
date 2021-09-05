import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseEndMatchSymbol(logger) {
	const cases = [
	{
		'code': '1 .. *',
		'treeInfo': {
			'children': [
				{'val': '..', 'type': ParseTreeTokenType.BINARY_OPERATOR,
				'children': [
					{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
					{'val': '*', 'type': ParseTreeTokenType.END_MATCH_SYMBOL, 'children': []}
				]}
			]
		}
	},
	{
		'code': '* .. 10',
		'treeInfo': {
			'children': [
				{'val': '..', 'type': ParseTreeTokenType.BINARY_OPERATOR,
				'children': [
					{'val': '*', 'type': ParseTreeTokenType.END_MATCH_SYMBOL, 'children': []},
					{'val': '10', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
				]}
			]
		}
	}
	];
	processParseTestCases(cases, logger);
};