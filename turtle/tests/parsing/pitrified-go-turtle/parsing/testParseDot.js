import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseDot(logger) {
	const cases = [
	{
		'code': '.x',
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DOT_PROPERTY, 'children': [
					{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': []},
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		}
	},
	{
		'code': 'p.x',
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
					{'val': 'p', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': []},
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		}
	},
	{
		'code': 'x.y.z',
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': []},
						{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]},
					{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': []},
					{'val': 'z', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]
				}
			]
		}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);	
}