import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseFunc(logger) {
	const cases = [
		{'code': 'func(i interface{}) {}',
			'treeInfo': {
			'children': [
				{'val': 'func', 'type': ParseTreeTokenType.FUNC, 'children': [
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST,
						'children': [
							{'val': '(', 'children': []},
							{'val': 'i'},
							{'val': ')', 'children': []}
						]
					},
					{'val': null, 'children': [
						{'val': '{', 'children': []},
						{'val': '}', 'children': []}
					]}
				]}
			]
		}
		},
		{'code': 'func intSeq() func() int {',
			'treeInfo': {
			'children': [
				{'val': 'func', 'type': ParseTreeTokenType.FUNC, 'children': [
					{'val': 'intSeq', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': ')', 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []}
					]}
				]}
			]}
		},
		{'code': 'func (v Vertex) m() float64 {',
			'treeInfo': {
			'children': [
				{'val': 'func', 'type': ParseTreeTokenType.FUNC, 'children': [
					{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION},
					{'val': 'm', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': ')', 'children': []}
					]},
					{},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []}
					]}
				]}
			]}
		},
		{'code': `var fib func(n int) int`,
			'treeInfo': {
			'children': [
				{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
					{'val': 'fib', 'children': [
						// The func should be parsed as a data type for the fib variable.
						{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
							{'val': 'func', 'type': ParseTreeTokenType.FUNC}
						]}
					]}
				]}
			]}
		}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};