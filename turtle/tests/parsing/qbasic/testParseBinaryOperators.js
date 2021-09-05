import { ParseTreeTokenType } from
'../../../modules/parsing/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseBinaryOperators(logger) {
	const cases = [{
		'code': 'print 3+2',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'print', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL},
							{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]},
					]}
				]},
			]
		}
	},{
		'code': 'print 3-2',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'print', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '-', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL},
							{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]},
					]}
				]},
			]
		}
	},{
		'code': 'print 3+2+1',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'print', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
								{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL},
								{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL},
							]},
							{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]},
					]}
				]},
			]
		}
	},{
		'code': 'print 3+2*1',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'print', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL},
							{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
								{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL},
								{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL}
							]},
						]},
					]}
				]},
			]
		}
	}, {
		'code': 'i% = 1 OR i% = 2',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
					{'val': 'i%', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': 'OR', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL},
						{'val': '=', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': 'i%'},
							{'val': '2'}
						]},
					]}
				]},
			]
		}
	}, {
		'code': 'x = y - z',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': '-', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': 'z', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					]},
				]},
			]},
	},{
		'code': 'B - y - (',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '-', 'children': [
					{'val': '-', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': 'B', 'children': []},
						{'val': 'y', 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
					'children': [
						{'val': '(', 'children': []}
					]}
				]}
			]}
	}];
	processParseTestCases(cases, logger);
};