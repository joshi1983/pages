import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseUnaryOperator(logger) {
	const cases = [
	{
		'code': '-x',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': '-',
				'type': ParseTreeTokenType.UNARY_OPERATOR,
				'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]
				}
			]
		}
	},
	{
		'code': 'print -x',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{
				'val': 'print',
				'type': ParseTreeTokenType.FUNCTION_CALL,
				'children': [
					{'val': null,
					'type': ParseTreeTokenType.ARGUMENT_LIST,
					'children': [
						{
							'val': '-',
							'type': ParseTreeTokenType.UNARY_OPERATOR,
							'children': [
								{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
							]
						}
					]}
				]
				}
			]
		}
	},
	{
		'code': 'not x',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': 'not',
				'type': ParseTreeTokenType.UNARY_OPERATOR,
				'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]
				}
			]
		}
	},
	{
		'code': `starx = -(25*20) / 2`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': '=',
				'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR,
				'children': [
					{'val': 'starx', 'children': []},
					{}
				]
			}
			]
		}
	}
	];
	processParseTestCases(cases, logger);
};