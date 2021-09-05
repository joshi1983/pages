import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseGosub(logger) {
	const cases = [{
		'code': `GOSUB 1
1`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'GOSUB', 'type': ParseTreeTokenType.GOSUB, 'children': [
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '1', 'children': []}
					]}
				]},
				{'val': '1', 'type': ParseTreeTokenType.LABEL, 'children': []},
			]
		}
	},{
		'code': `print
gosub`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'print', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []}
				]},
				{'val': 'gosub', 'type': ParseTreeTokenType.GOSUB, 'children': [
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []}
				]}
			]}
	}];
	processParseTestCases(cases, logger);
};