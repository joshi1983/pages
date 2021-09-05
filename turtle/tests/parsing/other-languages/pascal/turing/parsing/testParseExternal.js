import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseExternal(logger) {
	const cases = [
	{
		'code': 'external "x"',
		'treeInfo': {
			'children': [
				{'val': 'external', 'type': ParseTreeTokenType.EXTERNAL, 'children': [
					{'val': '"x"', 'type': ParseTreeTokenType.STRING_LITERAL, 'children': []}
				]}
			]
		}
	},
	{
		'code': 'external var ERRFLAG: int',
		'treeInfo': {
			'children': [
				{'val': 'external', 'type': ParseTreeTokenType.EXTERNAL, 'children': [
					{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
						{'val': 'ERRFLAG', 'children': []},
						{'val': ':', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
							{'val': 'int', 'children': []}
						]},
					]}
				]}
			]
		}
	},
	{
		'code': 'external var ERRFLAG: int\nput "hi"',
		'treeInfo': {
			'children': [
				{'val': 'external', 'type': ParseTreeTokenType.EXTERNAL, 'children': [
					{'val': 'var', 'type': ParseTreeTokenType.VAR}
				]},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL}
			]
		}
	},
	];
	processParseTestCases(cases, logger);
};