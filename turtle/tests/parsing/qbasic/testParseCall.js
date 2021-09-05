import { ParseTreeTokenType } from
'../../../modules/parsing/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseCall(logger) {
	const cases = [{
		'code': 'call subroutine1()',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'call', 'type': ParseTreeTokenType.CALL, 'children': [
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
						{'val': 'subroutine1', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '('},
							{'val': ')'},
						]}
					]}
				]}
			]
		}
	},{
		'code': `SUB ADD (x, y)
END SUB
call ADD`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'SUB', 'type': ParseTreeTokenType.SUB},
				{'val': 'call', 'type': ParseTreeTokenType.CALL, 'children': [
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
						{'val': 'ADD'},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
					]}
				]}
			]}
	},{
		'code': `SUB ADD (x, y)
END SUB
call ADD(3, 4)`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'SUB', 'type': ParseTreeTokenType.SUB},
				{'val': 'call', 'type': ParseTreeTokenType.CALL, 'children': [
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
						{'val': 'ADD'},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
					]}
				]}
			]}
	}];
	processParseTestCases(cases, logger);
};