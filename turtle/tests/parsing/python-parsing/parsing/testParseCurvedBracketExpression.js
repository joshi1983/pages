import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseCurvedBracketExpression(logger) {
	const cases = [
	{
		'code': '(1+2)',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
					{'val': '(', 'children': []},
					{'val': '+', 'children': [
						{'val': '1', 'children': []},
						{'val': '2', 'children': []}
					]},
					{'val': ')', 'children': []}
				]}
			]
		}
	},
	{
		'code': 'x=(1+2)',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': '=',
				'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR,
				'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
						{'val': '(', 'children': []},
						{'val': '+', 'children': [
							{'val': '1', 'children': []},
							{'val': '2', 'children': []}
						]},
						{'val': ')', 'children': []}
					]}
				]
				}
			]
		}
	},
	{
		'code': 'x==(1+2)',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': '==',
				'type': ParseTreeTokenType.BINARY_OPERATOR,
				'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
						{'val': '(', 'children': []},
						{'val': '+', 'children': [
							{'val': '1', 'children': []},
							{'val': '2', 'children': []}
						]},
						{'val': ')', 'children': []}
					]}
				]
				}
			]
		}
	},
	{
		'code': '-(1)',
		'numTopChildren': 1,
	},
	{
		'code': '-(1+2)',
		'numTopChildren': 1,
	},
	{
		'code': '-(1*2)',
		'numTopChildren': 1,
	},
	{
		'code': 'x-(1*2)',
		'numTopChildren': 1,
	}
	];
	processParseTestCases(cases, logger);
};