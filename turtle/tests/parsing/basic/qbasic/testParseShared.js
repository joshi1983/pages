import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseShared(logger) {
	const cases = [{
		'code': `shared x`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'shared', 'type': ParseTreeTokenType.SHARED, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]},
			]
		}
	},{
		'code': `shared x,y`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'shared', 'type': ParseTreeTokenType.SHARED, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
					{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
				]},
			]
		}
	},{
		'code': `sub p ()
	shared x
	x = 3`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'sub', 'type': ParseTreeTokenType.SUB, 'children': [
					{'val': 'p', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'shared', 'children': [
							{'val': 'x'}
						]},
						{'val': '=', 'children': [
							{'val': 'x'},
							{'val': '3'}
						]},
					]},
				]}
		]}
	}];
	processParseTestCases(cases, logger);
};