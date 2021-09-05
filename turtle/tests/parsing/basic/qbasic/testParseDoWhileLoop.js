/*
There is a loop that looks to be in QBasic based on an example at:
https://www.bamsoftware.com/bzr/qbasic/bamstart.bas
See the delay subroutine.

The format goes like:
DO WHILE <condition>
	<code block>
LOOP

We want the parser to handle it gracefully.
*/

import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseDoWhileLoop(logger) {
	const cases = [{
		'code': 'DO WHILE',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DO_WHILE, 'children': [
					{'val': 'DO', 'type': ParseTreeTokenType.DO, 'children': []},
					{'val': 'WHILE', 'type': ParseTreeTokenType.WHILE, 'children': []}
				]},
		]},
	},{
		'code': `DO WHILE x`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DO_WHILE, 'children': [
					{'val': 'DO', 'type': ParseTreeTokenType.DO, 'children': []},
					{'val': 'WHILE', 'type': ParseTreeTokenType.WHILE, 'children': [
						{'val': 'x', 'children': []},
					]}
				]}
		]}
	},{
		'code': `DO WHILE x < 3`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DO_WHILE, 'children': [
					{'val': 'DO', 'type': ParseTreeTokenType.DO, 'children': []},
					{'val': 'WHILE', 'type': ParseTreeTokenType.WHILE, 'children': [
						{'val': '<', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': 'x', 'children': []},
							{'val': '3', 'children': []}
						]}
					]}
				]}
		]}
	},{
		'code': 'DO WHILE TIMER -',
		'parseSettings': {
			'skipScanTokenSanitization': true
		},
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DO_WHILE, 'children': [
					{'val': 'DO', 'type': ParseTreeTokenType.DO, 'children': []},
					{'val': 'WHILE', 'type': ParseTreeTokenType.WHILE, 'children': [
						{'val': '-', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
								{'val': 'TIMER', 'children': []},
								{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []}
							]}
						]},
					]},
				]}
			]
		}
	},{
		'code': 'DO WHILE TIMER - start#',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DO_WHILE, 'children': [
					{'val': 'DO', 'type': ParseTreeTokenType.DO, 'children': []},
					{'val': 'WHILE', 'type': ParseTreeTokenType.WHILE, 'children': [
						{'val': '-', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
								{'val': 'TIMER', 'children': []},
								{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []}
							]},
							{'val': 'start#', 'children': []}
						]},
					]},
				]}
			]
		}
	},{
		'code': `DO WHILE TIMER - start# < seconds!
LOOP`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DO_WHILE, 'children': [
					{'val': 'DO', 'type': ParseTreeTokenType.DO, 'children': []},
					{'val': 'WHILE', 'type': ParseTreeTokenType.WHILE, 'children': [
						{'val': '<', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': '-', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
								{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
									{'val': 'TIMER', 'children': []},
									{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []}
								]},
								{'val': 'start#', 'children': []}
							]},
							{'val': 'seconds!', 'children': []}
						]}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': 'LOOP', 'type': ParseTreeTokenType.LOOP}
				]}
			]
		}
	},{
		'code': `DO WHILE i% < 10
    i% = i% + 1
LOOP

WHILE`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DO_WHILE, 'children': [
					{'val': 'DO', 'type': ParseTreeTokenType.DO, 'children': []},
					{'val': 'WHILE', 'type': ParseTreeTokenType.WHILE},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
					{'val': 'LOOP', 'type': ParseTreeTokenType.LOOP, 'children': []}
				]},
				{'val': 'WHILE', 'type': ParseTreeTokenType.WHILE, 'children': []}
		]}
	},{
		'code': `DO WHILE y
LOOP
x`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DO_WHILE, 'children': [
					{'val': 'DO', 'type': ParseTreeTokenType.DO, 'children': []},
					{'val': 'WHILE', 'type': ParseTreeTokenType.WHILE},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
					{'val': 'LOOP', 'type': ParseTreeTokenType.LOOP, 'children': []}
				]},
				{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
		]}
	}];
	processParseTestCases(cases, logger);
};