import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseCodeBlocks(logger) {
	const cases = [
	{'code': `f();
{
	repcountPair = m;
};`, 'numTopChildren': 4},
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
			{'val': null},
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
			{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL},
			{'val': ';', 'type': ParseTreeTokenType.SEMICOLON},
			{'val': null},
			{'val': '}', 'type': ParseTreeTokenType.CURLY_RIGHT_BRACKET}
		]}
	]
})}
	];
	processParseTestCases(cases, logger);
};