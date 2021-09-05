import { ParseTreeTokenType } from
'../../../modules/parsing/qbasic/ParseTreeTokenType.js';
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
	}];
	processParseTestCases(cases, logger);
};