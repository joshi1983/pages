import { ParseTreeTokenType } from
'../../../modules/parsing/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseType(logger) {
	const cases = [{
		'code': `TYPE Employee
  ename AS STRING * 20
  salary AS SINGLE
END TYPE`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'TYPE', 'type': ParseTreeTokenType.TYPE, 'children': [
					{'val': 'Employee', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.TYPE_PROPERTY, 'children': [
						{'val': 'ename', 'children': []},
						{'val': 'AS', 'children': [
							{'val': null, 'type': ParseTreeTokenType.DATA_TYPE, 'children': [
								{'val': '*', 'children': [
									{'val': 'STRING'},
									{'val': '20'}
								]},
							]}
						]},
					]},
					{'val': null, 'type': ParseTreeTokenType.TYPE_PROPERTY, 'children': [
						{'val': 'salary', 'children': []},
						{'val': 'AS', 'children': [
							{'val': null, 'type': ParseTreeTokenType.DATA_TYPE, 'children': [
								{'val': 'SINGLE', 'children': []}
							]}
						]}
					]},
					{'val': null, 'type': ParseTreeTokenType.END_TYPE, 'children': [
						{'val': 'END'},
						{'val': 'TYPE'}
					]},
				]}
			]
		}
	},{
		'code': `TYPE testtype
    dataArray(4) AS INTEGER`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'TYPE', 'type': ParseTreeTokenType.TYPE, 'children': [
					{'val': 'testtype', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.TYPE_PROPERTY, 'children': [
						{'val': 'dataArray', 'children': []},
						{'val': null, 'children': [
							{'val': '('},
							{'val': '4'},
							{'val': ')'}
						]},
						{'val': 'AS', 'children': [
							{'val': null, 'type': ParseTreeTokenType.DATA_TYPE, 'children': [
								{'val': 'INTEGER'}
							]}
						]}
					]}
				]}
			]}
	}];
	processParseTestCases(cases, logger);
};