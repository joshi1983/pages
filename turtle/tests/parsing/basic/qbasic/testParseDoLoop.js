import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseDoLoop(logger) {
	const cases = [{
		'code': 'do',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'do', 'type': ParseTreeTokenType.DO, 'children': []}
			]
		}
	},{
		'code': `DO 
    PRINT n`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'DO', 'type': ParseTreeTokenType.DO, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': 'PRINT'},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
						]}
					]}
				]}
			]
		}
	},{
		'code': `DO 
    PRINT n
	loop`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'DO', 'type': ParseTreeTokenType.DO, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': 'PRINT'},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
						]}
					]},
					{'val': 'loop', 'type': ParseTreeTokenType.LOOP, 'children': []}
				]},
			]
		}
	}];
	processParseTestCases(cases, logger);
};