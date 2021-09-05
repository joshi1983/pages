import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseIfStatements(logger) {
	const cases = [
		{'code': 'if (true) {}', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.IF, 'val': 'if',
					'children': [
						{'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'val': null, 'children': [
							{'val': '('},
							{'val': 'true'},
							{'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET, 'val': ')'}
						]},
						{'type': ParseTreeTokenType.CODE_BLOCK, 'val': null, 'children': [
							{'val': '{'},
							{'val': '}'}
						]}
					]
				}
			]
		}},
		{'code': 'if (true);', 'numTopChildren': 2},
		{'code': 'if (false) console.log("hi")', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
				'children': [
					{'val': 'if', 'children': [
						{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
							{'val': '('},
							{'val': 'false'},
							{'val': ')'}
						]},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
							{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
								{'val': 'console', 'type': ParseTreeTokenType.IDENTIFIER, 'children': [
									{'val': '.', 'children': [
										{'val': 'log'}
									]}
								]},
								{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
							]}
						]}
					]}
				]
		}
		},
		{'code': 'if (false) ++i', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
				'children': [
					{'val': 'if', 'children': [
						{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
							{'val': '('},
							{'val': 'false'},
							{'val': ')'}
						]},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
							{'val': '++', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
								{'val': 'i', 'type': ParseTreeTokenType.IDENTIFIER}
							]}
						]}
					]}
				]
		}
		},
		{'code': 'if (false) ++i else {}', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
				'children': [
					{'val': 'if', 'children': [
						{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
							{'val': '('},
							{'val': 'false'},
							{'val': ')'}
						]},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
							{'val': '++', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
								{'val': 'i', 'type': ParseTreeTokenType.IDENTIFIER}
							]}
						]},
						{'val': 'else', 'type': ParseTreeTokenType.ELSE, 'children': [
							{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
								{'val': '{', 'type': ParseTreeTokenType.CURLY_LEFT_BRACKET},
								{'val': '}', 'type': ParseTreeTokenType.CURLY_RIGHT_BRACKET}
							]}
						]}
					]}
				]
		}
		},
		{'code': 'if (false) {} else {}', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
				'children': [
					{'val': 'if', 'children': [
						{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
							{'val': '('},
							{'val': 'false'},
							{'val': ')'}
						]},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
							{'val': '{'},
							{'val': '}'}
						]},
						{'val': 'else', 'type': ParseTreeTokenType.ELSE, 'children': [
							{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
								{'val': '{'},
								{'val': '}'}
							]},
						]}
					]}
				]
		}
		},
		{'code': 'if (false) {} else if (x) {}', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
				'children': [
					{'val': 'if', 'children': [
						{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
							{'val': '('},
							{'val': 'false'},
							{'val': ')'}
						]},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
							{'val': '{'},
							{'val': '}'}
						]},
						{'val': 'else', 'type': ParseTreeTokenType.ELSE_IF, 'children': [
							{'val': 'if', 'children': [
								{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
									{'val': '('},
									{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
									{'val': ')'}
								]},
								{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
									{'val': '{'},
									{'val': '}'}
								]},
							]}
						]}
					]}
				]
			}
		},
		{
			'code': `if (true)
	x = 1;
else {
}
x = 2;`,
			'numTopChildren': 3
		},
		{'code': `if (true) {
	f({'colour': 1});
}`, 'numTopChildren': 1},
{'code': `if (true)
	x = 1;
else if (false)
	y = 2;
else if (true)
	z = 3;
else {}
f()`, 'numTopChildren': 2},
		{'code': `if (!f1(f2(1), 2)) {}`, 'numTopChildren': 1},
		{'code': `if (true){
    dp[i][j] = dp[i-1][j-1];
} else {}`, 'numTopChildren': 1},
	{'code': `if (true) {}
else
	for (let i = 0; i < val.length; i++) {
	}
return true`, 'numTopChildren': 2
	},
	{'code': `if (true)
	msg = \`hi\`
else
	msg = \`bye\`+'hi'
f()`, 'numTopChildren': 2},
	{'code': `function p() {
	if (true)
		throw new Error();
	const result = 1;
	{
	}
	return result;
}`, 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
				'children': [
					{'val': 'function', 'children': [
						{'val': 'p'},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
							{'val': '{'},
							{'val': 'if'},
							{'val': 'const'},
							{'val': ';'},
							{'val': null},
							{'val': 'return'},
							{'val': ';'},
							{'val': '}'}
						]}
					]}
				]
			}},
	{'code': `try {}
catch () {}
if (true) {
}
else
	f2();`, 'numTopChildren': 2}
	];
	processParseTestCases(cases, logger);
};