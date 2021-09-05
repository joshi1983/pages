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
		{
			'code': 'var a [5]int',
			'treeInfo': {
				'children': [
					{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
						{'val': 'a', 'children': [
							{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
								{'val': null, 'type': ParseTreeTokenType.ARRAY_SUBSCRIPT, 'children': [
									{'val': '[', 'children': []},
									{'val': '5', 'children': []},
									{'val': ']', 'children': []}
								]},
								{'val': 'int', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
							]}
						]}
					]}
				]
			}
		},
		{
			'code': 'b = [...]int{1, 2, 3}',
			'treeInfo': {
				'children': [
					{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
						{'val': 'b', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.ARRAY_LITERAL, 'children': [
							{'val': null, 'type': ParseTreeTokenType.ARRAY_SUBSCRIPT, 'children': [
								{'val': '[', 'children': []},
								{'val': '...', 'type': ParseTreeTokenType.TRIPLE_DOT, 'children': []},
								{'val': ']', 'children': []}
							]},
							{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
								{'val': 'int', 'children': []}
							]},
							{'val': null, 'type': ParseTreeTokenType.ARRAY_VALUES_BLOCK, 'children': [
								{'val': '{', 'children': []},
								{'val': '1', 'children': []},
								{'val': ',', 'children': []},
								{'val': '2', 'children': []},
								{'val': ',', 'children': []},
								{'val': '3', 'children': []},
								{'val': '}', 'children': []}
							]}
						]}
					]}
				]}
		}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};