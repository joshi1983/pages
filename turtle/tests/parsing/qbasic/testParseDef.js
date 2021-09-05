
import { ParseTreeTokenType } from
'../../../modules/parsing/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

/*
DEF statements are documented at:
https://www.qbasic.net/en/reference/qb11/Statement/DEF-FN.htm
*/
export function testParseDef(logger) {
	const cases = [{
		'code': `DEF fnTest
END DEF`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'DEF', 'type': ParseTreeTokenType.DEF_FN, 'children': [
					{'val': 'fnTest', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.END_DEF, 'children': [
						{'val': 'END', 'type': ParseTreeTokenType.END, 'children': []},
						{'val': 'DEF', 'type': ParseTreeTokenType.DEF, 'children': []}
					]},
				]},
			]
		}
	},{
		'code': `DEF fnTest(`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'DEF', 'type': ParseTreeTokenType.DEF_FN, 'children': [
					{'val': 'fnTest', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '('}
					]},
				]},
			]
		}
	},{
		'code': `DEF fnTest(x$ as String)
		END DEF`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'DEF', 'type': ParseTreeTokenType.DEF_FN, 'children': [
					{'val': 'fnTest', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '('},
						{'val': 'x$', 'children': [
							{'val': 'as'}
						]},
						{'val': ')'},
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.END_DEF, 'children': [
						{'val': 'END'},
						{'val': 'DEF'}
					]},
				]},
			]
		}	}];
	processParseTestCases(cases, logger);
};