import { ParseTreeTokenType } from '../../../modules/parsing/processing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseCodeBlocks(logger) {
	const cases = [
	{'code': '{println("hi")}',
	'numTopChildren': 1,
	'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.CODE_BLOCK,
		'children': [
			{'val': '{'},
			{'val': null, 'type': ParseTreeTokenType.METHOD_CALL, 'children': [
				{'val': 'println'},
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
			{'val': null, 'type': ParseTreeTokenType.METHOD_CALL},
			{'val': ';'},
			{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
			{'val': ';'}
		]
	}},
	{'code': `f()
{
	repcountPair = m;
}`, 'numTopChildren': 2},
	{'code': `void f() {
	f2();
	{
		if (true)
			logger();
	}
}`, 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
	'type': ParseTreeTokenType.METHOD,
	'children': [
		{'val': 'void', 'type': ParseTreeTokenType.VOID},
		{'val': 'f'},
		{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
			{'val': '('},
			{'val': ')'}
		]},
		{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
			{'val': '{'},
			{'val': null, 'type': ParseTreeTokenType.METHOD_CALL, 'children': [
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
})
	},
	];
	processParseTestCases(cases, logger);
};