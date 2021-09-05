import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseFunctionCalls(logger) {
	const cases = [{
		'code': 'CLS',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'CLS', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []}
				]},
			]
		}
	},{
		'code': 'f',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'f', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
			]
		}
	},{
		'code': 'f(',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'f', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '('},
					]}
				]},
			]
		}
	},{
		'code': 'f()',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'f', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '('},
						{'val': ')'}
					]}
				]},
			]
		}
	},{
		'code': 'Ants(x).dir = Ants(',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL},
						{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': []},
						{'val': 'dir', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
						{'val': 'Ants', 'children': []},
						{'val': null, 'children': [
							{'val': '('}
						]}
					]}
				]}
			]
		}
	},{
		'code': 'PAINT (281, 1), c + 1',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'PAINT', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': null, 'type': ParseTreeTokenType.TUPLE_LITERAL},
						{'val': ',', 'children': []},
						{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': 'c', 'children': []},
							{'val': '1', 'children': []}
						]}
					]}
				]}
			]}
	},{
		'code': 'f (281, 1), c + 1',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'f', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': null, 'type': ParseTreeTokenType.TUPLE_LITERAL},
						{'val': ',', 'children': []},
						{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': 'c', 'children': []},
							{'val': '1', 'children': []}
						]}
					]}
				]}
			]}
	},{
		'code': `UnrecognizedFunctionName 25`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'UnrecognizedFunctionName', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '25', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]}
				]}
			]}
	},{
		'code': `UnrecognizedFunctionName 1
UnrecognizedFunctionName 11`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'UnrecognizedFunctionName', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]}
				]},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'UnrecognizedFunctionName', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '11', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]}
				]}
			]}
	},{
		'code': 'print x(i) /',
		'parseSettings': {
			'skipScanTokenSanitization': true
		},
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'print', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '/', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
								{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
								{'val': null, 'children': [
									{'val': '(', 'children': []},
									{'val': 'i', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
									{'val': ')', 'children': []}
								]}
							]}
						]}
					]}
				]},
			]},
	},{
		'code': `RANDOMIZE TIMER
WHILE`,
		'numTopChildren': 2,
	},{
		'code': `RANDOMIZE TIMER
for`,
		'numTopChildren': 2,
	},{
		'code': `RANDOMIZE TIMER
do`,
		'numTopChildren': 2,
	},{
		'code': `RANDOMIZE TIMER
if`,
		'numTopChildren': 2,
	},{
		'code': `RANDOMIZE TIMER
DIM x(3)`,
		'numTopChildren': 2,
	},{
		'code': `RANDOMIZE TIMER
REDIM x(3)`,
		'numTopChildren': 2,
	},{
		'code': `RANDOMIZE TIMER
ON`,
		'numTopChildren': 2,
	},{
		'code': `RANDOMIZE TIMER
PI = 3.1415927#`,
		'numTopChildren': 2
	},{
		'code': 'goto\n4',
		'numTopChildren': 1
	},{
		'code': '_pi / 2',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '/', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
						{'val': '_pi'},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []}
					]},
					{'val': '2', 'children': []}
				]},
			]}
	},{
		'code': 'RND(1)',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'RND', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': '1', 'children': []},
						{'val': ')', 'children': []}
					]},
				]},
			]}
	}];
	processParseTestCases(cases, logger);
};