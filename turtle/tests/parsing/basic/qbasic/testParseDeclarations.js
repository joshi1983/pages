import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseDeclarations(logger) {
	const cases = [{
		'code': 'CONST PI = 3.141593',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'CONST', 'type': ParseTreeTokenType.CONST, 'children': [
					{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
						{'val': 'PI', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': '3.141593', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
					]}
				]}
			]
		}
	},{
		'code': 'LET a = 5',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'LET', 'type': ParseTreeTokenType.LET, 'children': [
					{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
						{'val': 'a', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': '5', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
					]}
				]}
			]
		}
	},{
		'code': 'DECLARE SUB Move ()',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'DECLARE', 'type': ParseTreeTokenType.DECLARE, 'children': [
					{'val': 'SUB', 'type': ParseTreeTokenType.SUB, 'children': [
						{'val': 'Move', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '('},
							{'val': ')'}
						]},
					]}
				]}
			]
		}
	},{
		'code': `DECLARE SUB Move ()
COMMON SHARED x`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'DECLARE', 'type': ParseTreeTokenType.DECLARE, 'children': [
					{'val': 'SUB'},
				]},
				{'val': 'COMMON', 'children': [
					{'val': 'SHARED', 'children': [
						{'val': 'x'}
					]}
				]}
			]
		}
	},{
		'code': `DECLARE SUB b ()
b`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'DECLARE', 'type': ParseTreeTokenType.DECLARE, 'children': [
					{'val': 'SUB', 'children': [
						{'val': 'b', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '(', 'children': []},
							{'val': ')', 'children': []},
						]}
					]},
				]},
				{'val': null, 'children': [
					{'val': 'b', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []}
				]}
			]},
	}];
	processParseTestCases(cases, logger);
};