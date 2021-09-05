import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseArrayLiteral(logger) {
	const cases = [
	{
		'code': '[]int',
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.ARRAY_LITERAL, 'children': [
					{'val': null, 'type': ParseTreeTokenType.ARRAY_SUBSCRIPT, 'children': [
						{'val': '[', 'children': []},
						{'val': ']', 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
						{'val': 'int', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]}
				]}
			]
		}
	},
	{
			'code': `var tests = []int{0, 1}`,
			'treeInfo': {
				'children': [
					{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
						{'val': '=', 'children': [
							{'val': 'tests', 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARRAY_LITERAL}
						]}
					]}
				]
			}
		},
	{
			'code': `var tests = [2]int{0, 1}`,
			'treeInfo': {
				'children': [
					{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
						{'val': '=', 'children': [
							{'val': 'tests', 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARRAY_LITERAL}
						]}
					]}
				]
			}
		},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};