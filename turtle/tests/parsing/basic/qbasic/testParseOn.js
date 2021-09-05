import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseOn(logger) {
	const cases = [{
		'code': 'ON PEN GOSUB',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'ON', 'type': ParseTreeTokenType.ON, 'children': [
					{'val': 'PEN', 'children': []},
					{'val': 'GOSUB', 'type': ParseTreeTokenType.GOSUB, 'children': [
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []}
					]}
				]},
			]
		}
	},{
		'code': 'ON COM(1) GOSUB 80',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'ON', 'type': ParseTreeTokenType.ON, 'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'COM', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': '1', 'children': []},
						{'val': ')', 'children': []},
					]},
				]},
				{'val': 'GOSUB', 'type': ParseTreeTokenType.GOSUB, 'children': [
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '80', 'children': []}
					]}
				]}
			]}
		]}
	},{
		'code': 'ON Value GOTO One, Two, Three',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'ON', 'type': ParseTreeTokenType.ON, 'children': [
					{'val': 'Value', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
						{'val': 'GOTO', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': 'One', 'children': []},
							{'val': ',', 'children': []},
							{'val': 'Two', 'children': []},
							{'val': ',', 'children': []},
							{'val': 'Three', 'children': []},
						]}
					]}
				]}
			]}
	},{
		'code': 'timer on',
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'timer', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': 'on', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]}
				]}
			]}
	},{
		'code': `ON ERROR GOTO 0
1299`,'numTopChildren': 2,
		'treeInfo': {
			'children': [
				{'val': 'ON', 'type': ParseTreeTokenType.ON, 'children': [
					{'val': 'ERROR'},
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
						{'val': 'GOTO'},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '0'}
						]}
					]}
				]},
				{'val': '1299', 'type': ParseTreeTokenType.LABEL, 'children': []}
			]
		}
	}];
	processParseTestCases(cases, logger);
};