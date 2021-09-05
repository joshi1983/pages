import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseSubscript(logger) {
	const cases = [
	{
		'code': 'x[2]',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': null, 'type': ParseTreeTokenType.SUBSCRIPT_EXPRESSION,
				'children': [
					{
						'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []
					},
					{
						'val': null, 'type': ParseTreeTokenType.SUBSCRIPT, 'children': [
							{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET, 'children': []},
							{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
							{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET, 'children': []}
						]
					}
				]
			}]
		}
	},
	{
		'code': '[1,2][6]',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null, 'type': ParseTreeTokenType.SUBSCRIPT_EXPRESSION,
				'children': [
					{
						'val': null, 'type': ParseTreeTokenType.LIST_LITERAL, 'children': [
							{'val': '['},
							{'val': '1'},
							{'val': ','},
							{'val': '2'},
							{'val': ']'}
						]
					},
					{
						'val': null, 'type': ParseTreeTokenType.SUBSCRIPT, 'children': [
							{'val': '['},
							{'val': '6'},
							{'val': ']'}
						]
					},
				]
			}
		]}
	},
	{
		'code': 'x = [1,2][0]',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{
				'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{
					'val': null, 'type': ParseTreeTokenType.SUBSCRIPT_EXPRESSION,
					'children': [
						{
							'val': null, 'type': ParseTreeTokenType.LIST_LITERAL, 'children': [
								{'val': '['},
								{'val': '1'},
								{'val': ','},
								{'val': '2'},
								{'val': ']'}
							]
						},
						{
							'val': null, 'type': ParseTreeTokenType.SUBSCRIPT, 'children': [
								{'val': '['},
								{'val': '0'},
								{'val': ']'}
							]
						},
					]}
				],
			}
		]}
	},
	{
		'code': 'z = x[2]',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
					{'val': 'z', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.SUBSCRIPT_EXPRESSION,
					'children': [
						{
							'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []
						},
						{
							'val': null, 'type': ParseTreeTokenType.SUBSCRIPT, 'children': [
								{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET, 'children': []},
								{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
								{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET, 'children': []}
							]
						}
					]
					}
				],
			}]
		}
	},
	{
		'code': 'x[2:]',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.SUBSCRIPT_EXPRESSION,
				'children': [
					{
						'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []
					},
					{
						'val': null, 'type': ParseTreeTokenType.SUBSCRIPT, 'children': [
							{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET, 'children': []},
							{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
							{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
							{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET, 'children': []}
						]
					}
				]
				}
			]
		}
	},
	{
		'code': 'x[:2]',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.SUBSCRIPT_EXPRESSION,
				'children': [
					{
						'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []
					},
					{
						'val': null, 'type': ParseTreeTokenType.SUBSCRIPT, 'children': [
							{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET, 'children': []},
							{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
							{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
							{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET, 'children': []}
						]
					}
				]
				}
			]
		}
	},
	{
		'code': 'list1[0] = 5',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.SUBSCRIPT_EXPRESSION,
					'children': [
						{
							'val': 'list1', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []
						},
						{
							'val': null, 'type': ParseTreeTokenType.SUBSCRIPT, 'children': [
								{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET, 'children': []},
								{'val': '0', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
								{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET, 'children': []}
							]
						}
					]},
					{
						'val': '5', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []
					},
				]}
			]
		}
	},{
		'code': 'f()[0]',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.SUBSCRIPT_EXPRESSION,
				'children': [
					{'val': 'f', 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
						{'val': null}
					]},
					{'val': null, 'type': ParseTreeTokenType.SUBSCRIPT, 'children': [
						{'val': '[', 'children': []},
						{'val': '0', 'children': []},
						{'val': ']', 'children': []}
					]}
				]}
			]
		}
	},{
		'code': '[1,2,3][0]',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.SUBSCRIPT_EXPRESSION,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.LIST_LITERAL, 'children': [
						{'val': '['},
						{'val': '1'},
						{'val': ','},
						{'val': '2'},
						{'val': ','},
						{'val': '3'},
						{'val': ']'}
					]},
					{'val': null, 'type': ParseTreeTokenType.SUBSCRIPT, 'children': [
						{'val': '[', 'children': []},
						{'val': '0', 'children': []},
						{'val': ']', 'children': []}
					]}
				]}
			]
		}
	},{
		'code': '(1,2,3)[0]',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.SUBSCRIPT_EXPRESSION,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.TUPLE_LITERAL, 'children': [
						{'val': '('},
						{'val': '1'},
						{'val': ','},
						{'val': '2'},
						{'val': ','},
						{'val': '3'},
						{'val': ')'}
					]},
					{'val': null, 'type': ParseTreeTokenType.SUBSCRIPT, 'children': [
						{'val': '[', 'children': []},
						{'val': '0', 'children': []},
						{'val': ']', 'children': []}
					]}
				]}
			]
		}
	}
	];
	processParseTestCases(cases, logger);
};