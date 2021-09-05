import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseCommaExpression(logger) {
	const cases = [
	{
		'code': 'x,y',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{
					'val': null, 'type': ParseTreeTokenType.COMMA_EXPRESSION,
				'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
					{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		}
	},
	{
		'code': 'x,y,z',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.COMMA_EXPRESSION,
				'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
					{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
					{'val': 'z', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		}
	},
	{
		'code': 'x,y=',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
					{
					'val': null, 'type': ParseTreeTokenType.COMMA_EXPRESSION,
					'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
						{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]}
				]}
			]
		}
	},
	{
		'code': 'WIDTH, HEIGHT = 1600, 900',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
					{'val': null, 'type': ParseTreeTokenType.COMMA_EXPRESSION},
					{'val': null, 'type': ParseTreeTokenType.COMMA_EXPRESSION}
				]}
			]
		}
	},
	{
		'code': 'WIDTH, HEIGHT, z = 1600, 900, 100',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
					{'val': null, 'type': ParseTreeTokenType.COMMA_EXPRESSION, 'children': [
						{'val': 'WIDTH', 'children': []},
						{'val': ',', 'children': []},
						{'val': 'HEIGHT', 'children': []},
						{'val': ',', 'children': []},
						{'val': 'z', 'children': []},
					]},
					{'val': null, 'type': ParseTreeTokenType.COMMA_EXPRESSION, 'children': [
						{'val': '1600', 'children': []},
						{'val': ',', 'children': []},
						{'val': '900', 'children': []},
						{'val': ',', 'children': []},
						{'val': '100', 'children': []}
					]}
				]}
			]
		}
	}
	];
	processParseTestCases(cases, logger);
};