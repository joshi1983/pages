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
	},{
		'code': 'export x,y\nvar',
		'treeInfo': {
			'children': [
				{'val': 'export', 'type': ParseTreeTokenType.EXPORT, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
					{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]},
				{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': []}
			]
		}
	},{
		'code': 'export x,y\nprocedure',
		'treeInfo': {
			'children': [
				{'val': 'export', 'type': ParseTreeTokenType.EXPORT},
				{'val': 'procedure', 'children': []}
			]
		}
	},{
		'code': 'export x,y\nfunction',
		'treeInfo': {
			'children': [
				{'val': 'export', 'type': ParseTreeTokenType.EXPORT},
				{'val': 'function', 'children': []}
			]
		}
	}];
	processParseTestCases(cases, logger);
};