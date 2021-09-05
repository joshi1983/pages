import { parse } from
'../../../../modules/parsing/kojo/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/kojo/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseIf(logger) {
	const cases = [
		{'code': 'if (a == b) doSomething()',
		'treeInfo': {
			'children': [
				{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
						{'val': '(', 'children': []},
						{'val': '==', 'children': [
							{'val': 'a', 'children': []},
							{'val': 'b', 'children': []}
						]},
						{'val': ')', 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
							{'val': 'doSomething', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
						]},
					]}
				]}
			]}
		},
		{'code': `if (a == b) {
    doSomething()
}`,
		'treeInfo': {
			'children': [
				{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
						{'val': '(', 'children': []},
						{'val': '==', 'children': [
							{'val': 'a', 'children': []},
							{'val': 'b', 'children': []}
						]},
						{'val': ')', 'children': []},
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
							{'val': 'doSomething', 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
						]},
						{'val': '}', 'children': []}
					]}
				]}
			]}
		},
		{'code': `if (a == b) {
    doSomething()
} else {
    doSomethingElse()
}`,
		'treeInfo': {
			'children': [
				{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
							{'val': 'doSomething', 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
						]},
						{'val': '}', 'children': []}
					]},
					{'val': 'else', 'type': ParseTreeTokenType.ELSE, 'children': [
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
							{'val': '{', 'children': []},
							{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
								{'val': 'doSomethingElse', 'children': []},
								{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
							]},
							{'val': '}', 'children': []}
						]}
					]}
				]}
			]}
		},
		{'code': `if (a == b) {
} else if`,
		'treeInfo': {
			'children': [
				{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []},
						{'val': '}', 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.ELSE_IF, 'children': [
						{'val': 'else', 'type': ParseTreeTokenType.ELSE, 'children': []},
						{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': []},
					]}
				]}
			]}
		},
		{'code': 'if (a < b) a else b',
		'treeInfo': {
			'children': [
				{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'a', 'children': []},
					]},
					{'val': 'else', 'type': ParseTreeTokenType.ELSE, 'children': [
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
							{'val': 'b', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
						]}
					]}
				]}
			]}
		},
		{'code': 'if (a < b) a else {} b',
		'treeInfo': {
			'children': [
				{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'a', 'children': []},
					]},
					{'val': 'else', 'type': ParseTreeTokenType.ELSE, 'children': [
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
							{'val': '{', 'children': []},
							{'val': '}', 'children': []}
						]}
					]}
				]},
				{'val': 'b', 'children': []}
			]}
		}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
}