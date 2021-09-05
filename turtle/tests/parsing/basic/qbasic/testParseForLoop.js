import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseForLoop(logger) {
	const cases = [{
		'code': `FOR num = 1 TO 10
NEXT num`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FOR', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'TO', 'children': [
						{'val': '=', 'children': [
							{'val': 'num', 'type': ParseTreeTokenType.IDENTIFIER},
							{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]},
						{'val': '10', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': 'NEXT', 'type': ParseTreeTokenType.NEXT, 'children': [
						{'val': 'num'},
					]}
				]},
			]
		}
	},{
		'code': `FOR num = 1 TO 10
    PRINT num;
NEXT num`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FOR', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'TO', 'children': [
						{'val': '=', 'children': [
							{'val': 'num', 'type': ParseTreeTokenType.IDENTIFIER},
							{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]},
						{'val': '10', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': 'PRINT'},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
								{'val': 'num', 'type': ParseTreeTokenType.IDENTIFIER},
								{'val': ';', 'type': ParseTreeTokenType.SEMICOLON}
							]}
						]}
					]},
					{'val': 'NEXT', 'type': ParseTreeTokenType.NEXT, 'children': [
						{'val': 'num'},
					]}
				]},
			]
		}
	},{
		'code': `FOR i = 2 TO 20 STEP a`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FOR', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'TO', 'children': [
						{'val': '=', 'children': [
							{'val': 'i', 'type': ParseTreeTokenType.IDENTIFIER},
							{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]},
						{'val': '20', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]},
					{'val': 'STEP', 'type': ParseTreeTokenType.STEP, 'children': [
						{'val': 'a', 'type': ParseTreeTokenType.IDENTIFIER}
					]},
				]},
			]
		}
	},{
		'code': `FOR i = 2 TO 20 STEP a + 2`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FOR', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'TO', 'children': [
						{'val': '=', 'children': [
							{'val': 'i', 'type': ParseTreeTokenType.IDENTIFIER},
							{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]},
						{'val': '20', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]},
					{'val': 'STEP', 'type': ParseTreeTokenType.STEP, 'children': [
						{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': 'a', 'type': ParseTreeTokenType.IDENTIFIER},
							{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]}
					]},
				]},
			]
		}
	},{
		'code': `FOR i = 2 TO 20 STEP 2
  sum = sum + i
NEXT i`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FOR', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'TO', 'children': [
						{'val': '=', 'children': [
							{'val': 'i', 'type': ParseTreeTokenType.IDENTIFIER},
							{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]},
						{'val': '20', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]},
					{'val': 'STEP', 'type': ParseTreeTokenType.STEP, 'children': [
						{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
							{'val': 'sum'},
							{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
								{'val': 'sum', 'type': ParseTreeTokenType.IDENTIFIER},
								{'val': 'i', 'type': ParseTreeTokenType.IDENTIFIER}
							]}
						]}
					]},
					{'val': 'NEXT', 'type': ParseTreeTokenType.NEXT, 'children': [
						{'val': 'i'},
					]}
				]},
			]
		}
		},{
		'code': `FOR i = 2 TO 20 STEP 2
NEXT i`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FOR', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'TO', 'children': [
						{'val': '=', 'children': [
							{'val': 'i', 'type': ParseTreeTokenType.IDENTIFIER},
							{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]},
						{'val': '20', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]},
					{'val': 'STEP', 'type': ParseTreeTokenType.STEP, 'children': [
						{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
					]},
					{'val': 'NEXT', 'type': ParseTreeTokenType.NEXT, 'children': [
						{'val': 'i'},
					]}
				]},
			]
		}
	},{
		'code': `FOR i = 1 TO 3 ' Outer Loop
    FOR j = 1 TO 2 ' Inner Loop
        PRINT "i = "; i; ", j = "; j
    NEXT j
NEXT i`,
		'numTopChildren': 1,
		'numComments': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FOR', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'TO', 'children': [
						{'val': '=', 'children': [
							{'val': 'i', 'type': ParseTreeTokenType.IDENTIFIER},
							{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]},
						{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
					{'val': 'NEXT', 'type': ParseTreeTokenType.NEXT, 'children': [
						{'val': 'i'},
					]}
				]}
			]
		}
	}, {
		'code': 'FOR sd = 0 TO 2500: NEXT sd',
		'numTopChildren': 1,
		'numStatementSeparators': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FOR', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'TO', 'children': [
						{'val': '=', 'children': [
							{'val': 'sd', 'type': ParseTreeTokenType.IDENTIFIER},
							{'val': '0', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]},
						{'val': '2500', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': 'NEXT', 'type': ParseTreeTokenType.NEXT, 'children': [
						{'val': 'sd'},
					]}
				]},
			]
		}
	},{
		'code': `FOR x = 1 TO 10
NEXT

XDist`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FOR', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'TO', 'children': [
						{'val': '=', 'children': [
							{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
							{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]},
						{'val': '10', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': 'NEXT', 'type': ParseTreeTokenType.NEXT, 'children': []}
				]},
				{'val': 'XDist', 'type': ParseTreeTokenType.IDENTIFIER}
			]}
	},{
		'code': `FOR p = 1 TO LEN(p$):
  SELECT`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FOR', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'TO', 'children': [
						{'val': '=', 'children': [
							{'val': 'p', 'type': ParseTreeTokenType.IDENTIFIER},
							{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]},
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': 'LEN', 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
						]}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'SELECT', 'type': ParseTreeTokenType.SELECT, 'children': []}
					]}
				]}
		]}
	},{
		'code': `FOR j = 1 TO N
NEXT j
QX`, 'numTopChildren': 2
	},{
		'code': `FOR j = 1 TO N
NEXT j
select`, 'numTopChildren': 2
	},{
		'code': `FOR j = 1 TO N
NEXT j
if`, 'numTopChildren': 2
	},{
		'code': `FOR j = 1 TO N
NEXT j
while`, 'numTopChildren': 2
	},{
		'code': `FOR j = 1 TO N
NEXT j
do`, 'numTopChildren': 2
	},{
		'code': `FOR j = 1 TO N
NEXT j
dim`, 'numTopChildren': 2
	},{
		'code': `FOR j = 1 TO N
NEXT j
redim`, 'numTopChildren': 2
	},{
		'code': `FOR j = 1 TO N
NEXT j
shared`, 'numTopChildren': 2
	},{
		'code': `FOR j = 1 TO N
NEXT j
common`, 'numTopChildren': 2
	},{
		'code': `FOR j = 1 TO N
NEXT j
let`, 'numTopChildren': 2
	},{
		'code': `FOR j = 1 TO N
NEXT j
const`, 'numTopChildren': 2
	},{
		'code': `FOR x = DW / 2 TO 10
NEXT
NextCol =`,
		'numTopChildren': 2
	},{
		'code': `FOR x = DW / 2 TO 1 STEP -1
NEXT
NextCol =`,
		'numTopChildren': 2
	},{
		'code': `FOR extra = 1 TO 23
  EXIT FOR
NEXT extra
`, 'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FOR', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'TO'},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'EXIT', 'children': [
							{'val': 'FOR', 'children': []}
						]}
					]},
					{'val': 'NEXT', 'children': [
						{'val': 'extra', 'children': []}
					]},
				]}
			]}
	}];
	processParseTestCases(cases, logger);
};