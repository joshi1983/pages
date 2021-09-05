import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseDoLoopWhile(logger) {
	const cases = [{
		'code': `DO 
    PRINT n
    n = n + 1
LOOP WHILE n <= 10`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'DO', 'type': ParseTreeTokenType.DO, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL},
						{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
							{'val': 'n'},
							{'val': '+'}
						]},
					]},
					{'val': null, 'type': ParseTreeTokenType.LOOP_WHILE, 'children': [
						{'val': 'LOOP', 'type': ParseTreeTokenType.LOOP},
						{'val': 'WHILE', 'type': ParseTreeTokenType.WHILE, 'children': [
							{'val': '<=', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
								{'val': 'n'},
								{'val': '10'}
							]}
						]},
					]}
				]}
			]
		}
	},{
		'code': `DO 
LOOP WHILE n <= 10
print "hi"`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'DO', 'type': ParseTreeTokenType.DO},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL}
			]
		}
	},{
		'code': `DO 
LOOP WHILE n <= 10
x = 4`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'DO', 'type': ParseTreeTokenType.DO},
				{'val': '=', 'children': [
					{'val': 'x'},
					{'val': '4'}
				]}
			]
		}
	},{
		'code': `DO
30    'Lbl 20
LOOP WHILE f > 0`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'DO', 'type': ParseTreeTokenType.DO,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK,
					'children': [
						{'val': '30', 'type': ParseTreeTokenType.LABEL, 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.LOOP_WHILE}
				]},
			]
		}
	},{
		'code': `do DO
LOOP WHILE x
loop while y`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'do', 'type': ParseTreeTokenType.DO,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'DO', 'type': ParseTreeTokenType.DO}
					]},
					{'val': null, 'type': ParseTreeTokenType.LOOP_WHILE, 'children': [
						{'val': 'loop'},
						{'val': 'while'}
					]}
				]
				}
			]
		}
	}];
	processParseTestCases(cases, logger);
};