import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseExit(logger) {
	const cases = [
	{
		'code': 'exit when',
		'treeInfo': {
			'children': [
				{'val': 'exit', 'type': ParseTreeTokenType.EXIT,
				'children': [
					{'val': 'when', 'type': ParseTreeTokenType.WHEN, 'children': []}
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};