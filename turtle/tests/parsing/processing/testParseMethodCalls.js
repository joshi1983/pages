import { ParseTreeTokenType } from '../../../modules/parsing/processing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseMethodCalls(logger) {
	const cases = [
		{'code': 'f(x)', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject(
			{'val': null, 'type': ParseTreeTokenType.METHOD_CALL,
			'children': [
				{
					'type': ParseTreeTokenType.IDENTIFIER,
					'val': 'f',
					'children': [
					]
				},
				{'type': ParseTreeTokenType.ARG_LIST, 'val': null, 'children': [
					{'val': '('},
					{'val': 'x'},
					{'val': ')'}
				]}
			]}
		)},
		{'code': 'float(x)', 'numTopChildren': 1,
		'treeInfo': wrapSingleTreeInfoObject(
			{'val': null, 'type': ParseTreeTokenType.METHOD_CALL, 'children': [
				{
					'type': ParseTreeTokenType.IDENTIFIER,
					'val': 'float',
					'children': []
				},
				{'type': ParseTreeTokenType.ARG_LIST, 'val': null, 'children': [
					{'val': '('},
					{'val': 'x'},
					{'val': ')'}
				]}
			]})
		},
		{'code': 'int(x)', 'numTopChildren': 1,
		'treeInfo': wrapSingleTreeInfoObject(
			{'val': null, 'type': ParseTreeTokenType.METHOD_CALL, 'children': [
				{
					'type': ParseTreeTokenType.IDENTIFIER,
					'val': 'int',
					'children': []
				},
				{'type': ParseTreeTokenType.ARG_LIST, 'val': null, 'children': [
					{'val': '('},
					{'val': 'x'},
					{'val': ')'}
				]}
			]})
		},
		{'code': 'alert("hi");', 'numTopChildren': 2, 'maxDepth': 4},
		{'code': 'log(4);', 'numTopChildren': 2, 'maxDepth': 4, 'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'children': [
					{'type': ParseTreeTokenType.METHOD_CALL, 'children': [
						{
							'type': ParseTreeTokenType.IDENTIFIER,
							'val': 'log',
							'children': []
						},
						{'type': ParseTreeTokenType.ARG_LIST, 'val': null,
							'children': [
								{'type': ParseTreeTokenType.CURVED_LEFT_BRACKET, 'val': '('},
								{'type': ParseTreeTokenType.NUMBER_LITERAL, 'val': '4'},
								{'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET, 'val': ')'}
							]
						}
					]},
					{
						'type': ParseTreeTokenType.SEMICOLON,
						'val': ';'
					}
				]
			}
		},
		{'code': 'println(4);println(5)', 'numTopChildren': 3, 'maxDepth': 4},
		{'code': 'x.y(4)', 'numTopChildren': 1, 'maxDepth': 5, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{
					'type': ParseTreeTokenType.METHOD_CALL,
					'children': [
						{'type': ParseTreeTokenType.EXPRESSION_DOT, 'val': null, 'children': [
							{
								'type': ParseTreeTokenType.IDENTIFIER,
								'val': 'x',
							'children': []
							},
							{'type': ParseTreeTokenType.DOT, 'val': '.',
								'children': [
									{'type': ParseTreeTokenType.IDENTIFIER, 'val': 'y', 'children': [
									]},
								]
							}
							]
						},
						{'type': ParseTreeTokenType.ARG_LIST, 'val': null,
							'children': [
								{'type': ParseTreeTokenType.CURVED_LEFT_BRACKET, 'val': '('},
								{'type': ParseTreeTokenType.NUMBER_LITERAL, 'val': '4'},
								{'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET, 'val': ')'}
							]
						}
					]
				}
			]
		}},
		{'code': 'println(("x"))', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null,
					'type': ParseTreeTokenType.METHOD_CALL,
					'children': [
						{'val': 'println', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
							{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
								{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
								{'val': '"x"', 'type': ParseTreeTokenType.STRING_LITERAL},
								{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
							]},
							{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
						]}
				]}
			]}
		},
		{'code': 'println(("x"), ((1)))', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null,
					'type': ParseTreeTokenType.METHOD_CALL,
					'children': [
						{'val': 'println', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
							{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
								{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
								{'val': '"x"', 'type': ParseTreeTokenType.STRING_LITERAL},
								{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
							]},
							{'val': ',', 'type': ParseTreeTokenType.COMMA},
							{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
								{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
								{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
									{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
									{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL},
									{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
								]},
								{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
							]},
							{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
						]}
				]}
			]
		}},
		{'code': 'f(x) + key', 'numTopChildren': 1},
		{'code': 'f().p()', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null,
				'type': ParseTreeTokenType.METHOD_CALL,
				'children': [
					{'val': null,
					'type': ParseTreeTokenType.EXPRESSION_DOT,
					'children': [
						{'val': null,
						'type': ParseTreeTokenType.METHOD_CALL,
						'children': [
							{'val': 'f', 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
								{'val': '('},
								{'val': ')'}
							]}
						]
						},
						{'val': '.', 'children': [
							{'val': 'p', 'children': []}
						]}
					]},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '('},
						{'val': ')'},
					]}
				]}
			]}
		},
		{'code': 'array[methodName]()', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
			'type': ParseTreeTokenType.METHOD_CALL,
			'val': null,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION, 'children': [
					{'val': 'array', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.INDEX_EXPRESSION, 'children': [
						{'val': '['},
						{'val': 'methodName'},
						{'val': ']'}
					]}
				]},
				{'va': null, 'type': ParseTreeTokenType.ARG_LIST}
			]
		})},
		{'code': 'm.get(5)(1, 2)', 'numTopChildren': 1},
		{'code': '(f1().f2())', 'numTopChildren': 1},
		{'code': 'f1() f2()', 'numTopChildren': 2},
		{'code': 'f(dp2[i][j])', 'numTopChildren': 1},
		{'code': 'f(dp2[i-1][j])', 'numTopChildren': 1},
		{'code': 'f(dp1, dp2[i-1][j])', 'numTopChildren': 1},
		{'code': `A x = new A()
m();`, 'numTopChildren': 3, 'treeInfo': {
	'type': ParseTreeTokenType.TREE_ROOT,
	'children': [
		{'val': null, 'type': ParseTreeTokenType.DECLARATION, 'children': [
			{'val': 'A', 'type': ParseTreeTokenType.DATA_TYPE, 'children': []},
			{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
				{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': 'new', 'type': ParseTreeTokenType.NEW, 'children': [
					{'val': null, 'type': ParseTreeTokenType.METHOD_CALL, 'children': [
						{'val': 'A', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
					]}
				]},
			]},
		]},
		{'val': null, 'type': ParseTreeTokenType.METHOD_CALL, 'children': [
			{'val': 'm', 'type': ParseTreeTokenType.IDENTIFIER},
			{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
				{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
				{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET},
			]}
		]},
		{'val': ';'}
	]}
	}
	];
	processParseTestCases(cases, logger);
};