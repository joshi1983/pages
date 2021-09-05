import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseCase(logger) {
	const cases = [
	{
		'code': 'case x',
		'treeInfo': {
			'children': [
				{'val': 'case', 'type': ParseTreeTokenType.CASE, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};