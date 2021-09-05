import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseDoUntil(logger) {
	const cases = [{
		'code': 'DO UNTIL',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DO_UNTIL, 'children': [
					{'val': 'DO', 'type': ParseTreeTokenType.DO},
					{'val': 'UNTIL', 'type': ParseTreeTokenType.UNTIL},
				]}
			]
		}
	},{
		'code': 'DO UNTIL count = 10',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DO_UNTIL, 'children': [
					{'val': 'DO', 'type': ParseTreeTokenType.DO},
					{'val': 'UNTIL', 'type': ParseTreeTokenType.UNTIL, 'children': [
						{'val': '=', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': 'count'},
							{'val': '10'}
						]}
					]},
					
				]}
			]
		}
	},{
		'code': `DO UNTIL count = 10
LOOP`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DO_UNTIL, 'children': [
					{'val': 'DO', 'type': ParseTreeTokenType.DO},
					{'val': 'UNTIL', 'type': ParseTreeTokenType.UNTIL, 'children': [
						{'val': '=', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': 'count'},
							{'val': '10'}
						]}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': 'LOOP', 'type': ParseTreeTokenType.LOOP, 'children': []},
				]}
			]
		}
	},{
		'code': `DO UNTIL count = 10
	  count = count + 1`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DO_UNTIL, 'children': [
					{'val': 'DO', 'type': ParseTreeTokenType.DO},
					{'val': 'UNTIL', 'type': ParseTreeTokenType.UNTIL, 'children': [
						{'val': '=', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': 'count'},
							{'val': '10'}
						]}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
							{'val': 'count'},
							{'val': '+'}
						]},
					]}
				]}
			]
		}
	},{
		'code': `DO UNTIL count = 10
	  count = count + 1
	  PRINT "Count is now " + STR$(count)
	LOOP`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DO_UNTIL, 'children': [
					{'val': 'DO', 'type': ParseTreeTokenType.DO},
					{'val': 'UNTIL', 'type': ParseTreeTokenType.UNTIL, 'children': [
						{'val': '=', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': 'count'},
							{'val': '10'}
						]}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
							{'val': 'count'},
							{'val': '+'}
						]},
						{'val': null, 'children': [
							{'val': 'PRINT'},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
								{'val': '+'}
							]}
						]}
					]},
					{'val': 'LOOP', 'type': ParseTreeTokenType.LOOP, 'children': []},
				]}
			]
		}
	},{
		'code': `DO UNTIL count = 10
LOOP
x`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DO_UNTIL, 'children': [
					{'val': 'DO', 'type': ParseTreeTokenType.DO},
					{'val': 'UNTIL', 'type': ParseTreeTokenType.UNTIL},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
					{'val': 'LOOP', 'type': ParseTreeTokenType.LOOP}
				]},
				{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER}
			]
		}
	}];
	processParseTestCases(cases, logger);
};