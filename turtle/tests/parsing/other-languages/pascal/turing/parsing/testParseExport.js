import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseExport(logger) {
	const cases = [
	{
		'code': 'export x',
		'treeInfo': {
			'children': [
				{'val': 'export', 'type': ParseTreeTokenType.EXPORT, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		}
	},{
		'code': 'export x,',
		'treeInfo': {
			'children': [
				{'val': 'export', 'type': ParseTreeTokenType.EXPORT, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []}
				]}
			]
		}
	},{
		'code': 'export x,y',
		'treeInfo': {
			'children': [
				{'val': 'export', 'type': ParseTreeTokenType.EXPORT, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
					{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};