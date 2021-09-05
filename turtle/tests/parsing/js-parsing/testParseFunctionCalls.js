import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseFunctionCalls(logger) {
	const cases = [
		{'code': 'f(x)', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL,
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
			]
		}},
		{'code': 'f(x))', 'numTopChildren': 2,
		'ignoreMessagesContaining': 'Expected CURVED_RIGHT_BRACKET to have a parent in the types',
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{
						'type': ParseTreeTokenType.IDENTIFIER,
						'val': 'f',
						'children': []
					},
					{'type': ParseTreeTokenType.ARG_LIST, 'val': null, 'children': [
						{'val': '('},
						{'val': 'x'},
						{'val': ')'}
					]}
				]},
				{'val': ')'}
			]
		}},
		{'code': 'alert("hi");', 'numTopChildren': 2, 'maxDepth': 4},
		{'code': 'log(4);', 'numTopChildren': 2, 'maxDepth': 4, 'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'children': [
					{'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
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
		{'code': 'log(4);log(5)', 'numTopChildren': 3, 'maxDepth': 4},
		{'code': 'console.log(4)', 'numTopChildren': 1, 'maxDepth': 5, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{
					'type': ParseTreeTokenType.FUNCTION_CALL,
					'children': [
						{
							'type': ParseTreeTokenType.IDENTIFIER,
							'val': 'console',
							'children': [
								{'type': ParseTreeTokenType.DOT, 'val': '.',
									'children': [
										{'type': ParseTreeTokenType.IDENTIFIER, 'val': 'log', 'children': [
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
		{'code': 'log(("x"))', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null,
					'type': ParseTreeTokenType.FUNCTION_CALL,
					'children': [
						{'val': 'log', 'type': ParseTreeTokenType.IDENTIFIER},
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
		{'code': 'log(("x"), ((1)))', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null,
					'type': ParseTreeTokenType.FUNCTION_CALL,
					'children': [
						{'val': 'log', 'type': ParseTreeTokenType.IDENTIFIER},
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
		{'code': 'f(f1 => p === 2)[0]', 'numTopChildren': 1},
		{'code': 'f().p()', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null,
				'type': ParseTreeTokenType.FUNCTION_CALL,
				'children': [
					{'val': null,
					'type': ParseTreeTokenType.EXPRESSION_DOT,
					'children': [
						{'val': null,
						'type': ParseTreeTokenType.FUNCTION_CALL,
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
			'type': ParseTreeTokenType.FUNCTION_CALL,
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
		{'code': 'await context[1][2]()', 'numTopChildren': 1},
		{'code': 'f1() f2()', 'numTopChildren': 2},
		{'code': 'f(dp2[i][j])', 'numTopChildren': 1},
		{'code': 'f(dp2[i-1][j])', 'numTopChildren': 1},
		{'code': 'f(dp1, dp2[i-1][j])', 'numTopChildren': 1},
		{'code': 'const x = []\nf()', 'numTopChildren': 2},
		{'code': 'file.async()', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
			'type': ParseTreeTokenType.FUNCTION_CALL,
			'children': [{
				'val': 'file', 'type': ParseTreeTokenType.IDENTIFIER,
				'children': [
					{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
						{'val': 'async', 'type': ParseTreeTokenType.IDENTIFIER}
					]}
				]
				},{
				'type': ParseTreeTokenType.ARG_LIST,
				'children': [
					{'val': '('},
					{'val': ')'}
				]
				}
			]
		})},
		{'code': `const x = new A()
m();
`, 'numTopChildren': 3, 'treeInfo': {
	'type': ParseTreeTokenType.TREE_ROOT,
	'children': [
		{'val': 'const', 'type': ParseTreeTokenType.CONST},
		{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL,
		'children': [
			{'val': 'm', 'type': ParseTreeTokenType.IDENTIFIER},
			{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
		]},
		{'val': ';'}
		]}
	}
	];
	processParseTestCases(cases, logger);
};