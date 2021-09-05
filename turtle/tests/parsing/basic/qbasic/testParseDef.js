import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
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
		}
	},{
		'code': 'DEF SEG',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'DEF', 'type': ParseTreeTokenType.DEF,
				'children': [
					{'val': 'SEG', 'children': []}
				]
				}
			]
		}
	},{
		'code': 'DEF SEG = 0',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'DEF', 'type': ParseTreeTokenType.DEF,
				'children': [
					{'val': '=', 'children': [
						{'val': 'SEG', 'children': []},
						{'val': '0', 'children': []}
					]},
				]
				}
			]
		}
	},{
		'code': `DEF SEG=4
PRINT "hi"`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'DEF', 'type': ParseTreeTokenType.DEF,
				'children': [
					{'val': '=', 'children': [
						{'val': 'SEG', 'children': []},
						{'val': '4', 'children': []}
					]}
				]},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'PRINT', 'children': []},
					{'val': null, 'children': [
						{'val': '"hi"', 'children': []}
					]}
				]}
			]}
	},{
		'code': `IF 1 THEN DEF SEG:GOTO 1291`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'IF', 'type': ParseTreeTokenType.IF,
				'children': [
					{'val': '1'},
					{'val': 'THEN'},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'DEF'},
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': 'GOTO'},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
						]}
					]}
				]}
			]}
	},{
		'code': `def f() 
	exit def
end def`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'def', 'type': ParseTreeTokenType.DEF_FN, 'children': [
					{'val': 'f', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'exit', 'children': [
							{'val': 'def', 'children': []}
						]}
					]},
					{'val': null, 'type': ParseTreeTokenType.END_DEF, 'children': [
						{'val': 'end', 'children': []},
						{'val': 'def', 'children': []}
					]
					}
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};