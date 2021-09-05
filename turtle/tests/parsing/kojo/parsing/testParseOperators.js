import { parse } from
'../../../../modules/parsing/kojo/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/kojo/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseOperators(logger) {
	const cases = [
	{
		'code': '*',
		'treeInfo': {
			'children': [
				{'val': '*', 'children': [
				]}
			]
		}
	},
	{
		'code': 'x*y',
		'treeInfo': {
			'children': [
				{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		}
	},
	{
		'code': '!',
		'treeInfo': {
			'children': [
				{'val': '!', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
				]}
			]
		}
	},
	{
		'code': '!x',
		'treeInfo': {
			'children': [
				{'val': '!', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		}
	},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);	
}