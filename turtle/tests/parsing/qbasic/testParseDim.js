import { ParseTreeTokenType } from
'../../../modules/parsing/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseDim(logger) {
	const cases = [{
		'code': `DIM emp AS Employee`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'DIM', 'type': ParseTreeTokenType.DIM, 'children': [
					{'val': 'emp', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': 'AS', 'type': ParseTreeTokenType.AS, 'children': [
						{'val': null, 'type': ParseTreeTokenType.DATA_TYPE, 'children': [
							{'val': 'Employee', 'children': []},
						]}
					]}
				]}
			]
		}
	},{
		'code': `DIM box (1 TO 100)
'statements
REDIM box (1 TO 200)`,
		'numTopChildren': 2,
		'numComments': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'DIM', 'type': ParseTreeTokenType.DIM, 'children': [
					{'val': 'box', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'children': [
						{'val': '(', 'children': []},
						{'val': 'TO', 'children': [
							{'val': '1'},
							{'val': '100'}
						]},
						{'val': ')', 'children': []},
					]}
				]},
				{'val': 'REDIM', 'type': ParseTreeTokenType.REDIM, 'children': [
					{'val': 'box', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'children': [
						{'val': '(', 'children': []},
						{'val': 'TO', 'children': [
							{'val': '1'},
							{'val': '200'}
						]},
						{'val': ')', 'children': []},
					]}
				]}
			]
		}
	},{
		'code': 'DIM map(32,',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'DIM', 'type': ParseTreeTokenType.DIM, 'children': [
					{'val': 'map', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.TUPLE_LITERAL, 'children': [
						{'val': '(', 'children': []},
						{'val': '32', 'children': []},
						{'val': ',', 'children': []},
					]},
				]},
			]}
	},{
		'code': `DIM windw AS wind
XMin = 0`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'DIM', 'type': ParseTreeTokenType.DIM, 'children': [
					{'val': 'windw', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': 'AS', 'type': ParseTreeTokenType.AS, 'children': [
						{'val': null, 'type': ParseTreeTokenType.DATA_TYPE, 'children': [
							{'val': 'wind', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						]}
					]}
				]},
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
					{'val': 'XMin', 'children': []},
					{'val': '0', 'children': []}
				]}
			]
		}
	},{
		'code': 'DIM k AS _UNSIGNED LONG',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'DIM', 'type': ParseTreeTokenType.DIM, 'children': [
					{'val': 'k', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': 'AS', 'type': ParseTreeTokenType.AS, 'children': [
						{'val': null, 'type': ParseTreeTokenType.DATA_TYPE, 'children': [
							{'val': '_UNSIGNED'},
							{'val': 'LONG'}
						]}
					]}
				]}
			]}
	},{
		'code': `Dim S()
x = 0`,
		'numTopChildren': 2,
	},{
		'code': `Dim S()
sub`,
		'numTopChildren': 2,
	},{
		'code': `Dim S()
function`,
		'numTopChildren': 2,
	},{
		'code': `Dim S()
DIM`,
		'numTopChildren': 2,
	},{
		'code': `Dim S()
FOR`,
		'numTopChildren': 2,
	},{
		'code': `Dim S()
WHILE`,
		'numTopChildren': 2,
	},{
		'code': `Dim S()
END`,
		'numTopChildren': 2,
	},{
		'code': `dim a
a`, 'numTopChildren': 2
	}];
	processParseTestCases(cases, logger);
};