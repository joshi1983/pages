import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseCommaExpression(logger) {
	const cases = [
	{
		'code': 'i, j = 1,2',
		'treeInfo': {
			'children': [
				{'val': '=', 'children': [
					{'val': null, 'type': ParseTreeTokenType.COMMA_EXPRESSION, 'children': [
						{'val': 'i', 'children': []},
						{'val': ',', 'children': []},
						{'val': 'j', 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.COMMA_EXPRESSION, 'children': [
						{'val': '1', 'children': []},
						{'val': ',', 'children': []},
						{'val': '2', 'children': []}
					]}
				]}
			]
		}
	},
	{
		'code': 'if r,',
		'treeInfo': {
			'children': [
				{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': null, 'type': ParseTreeTokenType.COMMA_EXPRESSION, 'children': [
						{'val': 'r', 'children': []},
						{'val': ',', 'children': []}
					]}
				]}
			]
		}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};