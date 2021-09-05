import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseCodeBlocks(logger) {
	const cases = [
	{'code': '{console.log("hi")}',
	'numTopChildren': 1,
	'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.CODE_BLOCK,
		'children': [
			{'val': '{'},
			{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
				{'val': 'console'},
				{'val': null, 'children': [
					{'val': '('},
					{'val': '"hi"'},
					{'val': ')'}
				]}
			]},
			{'val': '}'},
		]
	})},
	{'code': `f();
{
	repcountPair = m;
};`, 'numTopChildren': 4,
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL},
			{'val': ';'},
			{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
			{'val': ';'}
		]
	}},
	{'code': `f()
{
	repcountPair = m;
}`, 'numTopChildren': 2},
	{'code': `function f() {
	f2();
	{
		if (true)
			logger();
	}
}`, 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
	'type': ParseTreeTokenType.FUNCTION,
	'children': [
		{'val': 'f'},
		{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
			{'val': '('},
			{'val': ')'}
		]},
		{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
			{'val': '{'},
			{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
				{'val': 'f2'},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
			]},
			{'val': ';'},
			{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
				{'val': '{'},
				{'val': 'if', 'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
				]},
				{'val': '}'},
			]},
			{'val': '}'}
		]}
	]
})},
{'code': `function f() {
	f2();
	{
		const expected = 'f';
	}
}`, 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
	'type': ParseTreeTokenType.FUNCTION,
	'val': 'function',
	'children': [
		{'val': 'f'},
		{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
		{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
			{'val': '{', 'type': ParseTreeTokenType.CURLY_LEFT_BRACKET},
			{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
				{'val': 'f2'},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
			]},
			{'val': ';', 'type': ParseTreeTokenType.SEMICOLON},
			{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
				{'val': '{'},
				{'val': 'const'},
				{'val': ';'},
				{'val': '}'},
			]},
			{'val': '}', 'type': ParseTreeTokenType.CURLY_RIGHT_BRACKET}
		]}
	]
})},
	{'code': 'repeat (6) {fd(3)}',
	'numTopChildren': 2,
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
				{'val': 'repeat'},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
			]},
			{'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
				{'val': '{'},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL,'children': [
					{'val': 'fd'},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
				]},
				{'val': '}'},
			]}
		]
	}
	},
	];
	processParseTestCases(cases, logger);
};