import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseExpressionDotProperty(logger) {
	const cases = [
	{
		'code': 'p.',
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY,
				'children': [
					{'val': 'p', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': []}
				]}
			]
		}
	},{
		'code': 'p.x',
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY,
				'children': [
					{'val': 'p', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': []},
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		}
	}
	];
	processParseTestCases(cases, logger);
};