import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseLabel(logger) {
	const cases = [{
		'code': `ColorTab:`,
		'numTopChildren': 1
	},{
		'code': `Dim StdFrac%
ColorTab:`,
		'numTopChildren': 2
	},{
		'code': `Dim StdFrac%(scrX% - 1, scrY% - 1)
ColorTab:`,
		'numTopChildren': 2
	},{'code': `FOR spl = 50 TO 0 STEP -10
rander:`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FOR', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'TO'},
					{'val': 'STEP'},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'rander', 'type': ParseTreeTokenType.LABEL, 'children': []}
					]}
				]}
			]}
	},{
		'code': `IF 1 THEN
END IF
13`, 'numTopChildren': 2,
		'treeInfo': {
			'children': [
				{'val': 'IF', 'children': [
					{'val': '1'},
					{'val': 'THEN'},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.END_IF, 'children': [
						{'val': 'END'},
						{'val': 'IF'}
					]}
				]},
				{'val': '13', 'type': ParseTreeTokenType.LABEL}
			]}
	},{
		'code': `30 IF 1 THEN
END IF`,
		'numTopChildren': 2,
		'treeInfo': {
			'children': [
				{'val': '30', 'type': ParseTreeTokenType.LABEL},
				{'val': 'IF'}
			]}
	},{
		'code': `LET B = 462
30 IF`,
		'numTopChildren': 3,
		'treeInfo': {
			'children': [
				{'val': 'LET'},
				{'val': '30', 'type': ParseTreeTokenType.LABEL},
				{'val': 'IF'}
			]}
	},{
		'code': `do while i < 10
loop
100`,
		'numTopChildren': 2,
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DO_WHILE, 'children': [
					{'val': 'do'},
					{'val': 'while'},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
					{'val': 'loop'}
				]},
				{'val': '100', 'type': ParseTreeTokenType.LABEL},
			]}
		
	},
	{
		'code': `Dim StdFrac%(7) 
480`,
		'numTopChildren': 2,
		'treeInfo': {
			'children': [
				{'val': 'Dim', 'type': ParseTreeTokenType.DIM},
				{'val': '480', 'type': ParseTreeTokenType.LABEL}
		]}
	},{
		'code': `f()
700`, 'numTopChildren': 2,
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL},
				{'val': '700', 'type': ParseTreeTokenType.LABEL}
		]}
	},{
		'code': `Do
Loop While my% = 0
1440`,
		'numTopChildren': 2,
		'treeInfo': {
			'children': [
				{'val': 'Do', 'type': ParseTreeTokenType.DO, 'children': [
					{'type': ParseTreeTokenType.CODE_BLOCK},
					{'type': ParseTreeTokenType.LOOP_WHILE, 'children': [
						{'type': ParseTreeTokenType.LOOP},
						{'type': ParseTreeTokenType.WHILE}
					]}
				]},
				{'val': '1440', 'type': ParseTreeTokenType.LABEL}
		]}
	},{
		'code': `While f% = 1
1110  Wend`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'While', 'type': ParseTreeTokenType.WHILE, 'children': [
					{'val': '='},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK,
					'children': [
						{'val': '1110', 'type': ParseTreeTokenType.LABEL}
					]},
					{'val': 'Wend', 'type': ParseTreeTokenType.WEND}
				]}
		]}
	},{
		'code': `For k% = 0 To nc%
label440: Next`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'For', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'To'},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK,
					'children': [
						{'val': 'label440', 'type': ParseTreeTokenType.LABEL}
					]},
					{'val': 'Next', 'type': ParseTreeTokenType.NEXT}
				]}
			]
		}
	},{
		'code': `DIM SHARED curLevel
860`, 'numTopChildren': 2,
		'treeInfo': {
			'children': [
				{'val': 'DIM', 'type': ParseTreeTokenType.DIM, 'children': [
					{'val': 'SHARED', 'children': [
						{'val': 'curLevel', 'type': ParseTreeTokenType.IDENTIFIER}
					]}
				]},
				{'val': '860', 'type': ParseTreeTokenType.LABEL},
			]
		}
	},{
		'code': `DEF SEG = 0
100`,
		'numTopChildren': 2,
		'treeInfo': {
			'children': [
				{'val': 'DEF', 'type': ParseTreeTokenType.DEF, 'children': [
					{'val': '='}
				]},
				{'val': '100', 'type': ParseTreeTokenType.LABEL, 'children': []},
			]
		}
	},{
		'code': `DEFINT X
100`,
		'numTopChildren': 2,
		'treeInfo': {
			'children': [
				{'val': 'DEFINT', 'type': ParseTreeTokenType.DEF_PRIMITIVE, 'children': [
					{'val': 'X'}
				]},
				{'val': '100', 'type': ParseTreeTokenType.LABEL, 'children': []},
			]
		}
	},{
		'code': `RETURN
1270`,
		'numTopChildren': 2,
		'treeInfo': {
			'children': [
				{'val': 'RETURN', 'type': ParseTreeTokenType.RETURN, 'children': []},
				{'val': '1270', 'type': ParseTreeTokenType.LABEL, 'children': []}
			]
		}
	},{
		'code': `FOR quake = 1 TO delayer
1500
1510 NEXT quake`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'FOR', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'TO'},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
					{'val': 'NEXT', 'type': ParseTreeTokenType.NEXT,
					'children': [
						{'val': 'quake'}
					]},
				]},
		]
		}
	},{
		'code': `        PRINT "K I L L S : "
1`, 'numTopChildren': 2,
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'PRINT', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '"K I L L S : "', 'children': []}
					]}
				]},
				{'val': '1', 'type': ParseTreeTokenType.LABEL, 'children': []},
			]
		}
	},{
		'code': `LINE (m, w)-(v, d), 5
8`, 'numTopChildren': 2,
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'LINE', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
				]},
				{'val': '8', 'type': ParseTreeTokenType.LABEL, 'children': []},
			]
		}
	},{
		'code': `IF k$ = "2" THEN
3510 COLOR 15
3550 END IF`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'IF', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '='},
					{'val': 'THEN'},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '3510', 'type': ParseTreeTokenType.LABEL, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': 'COLOR'},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
								{'val': '15'}
							]}
						]},
						{'val': '3550', 'type': ParseTreeTokenType.LABEL, 'children': []},
					]},
					{'val': null, 'type': ParseTreeTokenType.END_IF}
				]}
		]}
	},{
		'code': `FOR d = 1 TO (1 / 3) * u
2140 NEXT`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'FOR', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'TO'},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '2140', 'type': ParseTreeTokenType.LABEL}
					]},
					{'val': 'NEXT'},
				]}
			]
		}
	},{
		'code': `IF Answer = 2 THEN GOTO 1 ELSE GOTO 2
3 END
40`, 'numTopChildren': 2,
		'treeInfo': {
			'children': [
				{'val': 'IF', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '='},
					{'val': 'THEN'},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
					{'val': 'ELSE', 'type': ParseTreeTokenType.ELSE, 'children': [
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
					]},
					{'val': null, 'type': ParseTreeTokenType.END_IF, 'children': [
						{'val': 'END', 'children': []}
					]},
				]},
				{'val': '40', 'type': ParseTreeTokenType.LABEL, 'children': []}
			]
		}
	},{
		'code': `SUB ADD ()
90 END SUB`
	, 'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'SUB', 'type': ParseTreeTokenType.SUB, 'children': [
					{'val': 'ADD', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '('},
						{'val': ')'}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '90', 'type': ParseTreeTokenType.LABEL, 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.END_SUB, 'children': [
						{'val': 'END', 'type': ParseTreeTokenType.END, 'children': []},
						{'val': 'SUB', 'type': ParseTreeTokenType.SUB, 'children': []}
					]}
				]}
			]
		}
	},{
		'code': `SELECT CASE x
label320: CASE 0: x = 1
END SELECT`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'SELECT', 'type': ParseTreeTokenType.SELECT, 'children': [
					{'val': 'CASE', 'type': ParseTreeTokenType.CASE, 'children': [
						{'val': 'x', 'children': []}
					]},
					{'val': 'label320', 'type': ParseTreeTokenType.LABEL, 'children': []},
					{'val': 'CASE', 'type': ParseTreeTokenType.CASE, 'children': [
						{'val': '0'},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
					]},
					{'val': null, 'type': ParseTreeTokenType.END_SELECT}
				]}
			]
		}
	},{
		'code': `FUNCTION frac()
480
END FUNCTION`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'FUNCTION', 'type': ParseTreeTokenType.FUNCTION, 'children': [
					{'val': 'frac'},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '480', 'type': ParseTreeTokenType.LABEL}
					]},
					{'val': null, 'type': ParseTreeTokenType.END_FUNCTION, 'children': [
						{'val': 'END'},
						{'val': 'FUNCTION'}
					]}
				]}
			]
		}
	},{
		'code': `SELECT CASE key$
CASE 3
label130:`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'SELECT', 'type': ParseTreeTokenType.SELECT, 'children': [
					{'val': 'CASE', 'type': ParseTreeTokenType.CASE, 'children': [
						{'val': 'key$', 'children': []}
					]},
					{'val': 'CASE', 'type': ParseTreeTokenType.CASE, 'children': [
						{'val': '3'},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
							{'val': 'label130', 'type': ParseTreeTokenType.LABEL, 'children': []}
						]}
					]},
				]},
			]}
	},{
		'code': `DO UNTIL count = 10
label60: LOOP`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DO_UNTIL, 'children': [
					{'val': 'DO', 'type': ParseTreeTokenType.DO, 'children': []},
					{'val': 'UNTIL', 'type': ParseTreeTokenType.UNTIL, 'children': [
						{'val': '='}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'label60', 'type': ParseTreeTokenType.LABEL, 'children': []}
					]},
					{'val': 'LOOP', 'type': ParseTreeTokenType.LOOP, 'children': []}
				]}
			]}
	},{
		'code': `IF 1 THEN
END
140 END IF`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'IF', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '1', 'children': []},
					{'val': 'THEN', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': 'END', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []}
						]},
						{'val': '140', 'type': ParseTreeTokenType.LABEL, 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.END_IF, 'children': [
						{'val': 'END', 'type': ParseTreeTokenType.END, 'children': []},
						{'val': 'IF', 'type': ParseTreeTokenType.IF, 'children': []}
					]}
				]}
			]}
	},{
		'code': `IF 1 THEN
END
140
141
145 END IF`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'IF', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '1', 'children': []},
					{'val': 'THEN', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': 'END', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []}
						]},
						{'val': '140', 'type': ParseTreeTokenType.LABEL, 'children': []},
						{'val': '141', 'type': ParseTreeTokenType.LABEL, 'children': []},
						{'val': '145', 'type': ParseTreeTokenType.LABEL, 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.END_IF, 'children': [
						{'val': 'END', 'type': ParseTreeTokenType.END, 'children': []},
						{'val': 'IF', 'type': ParseTreeTokenType.IF, 'children': []}
					]}
				]}
			]}
	},{
		'code': `Select Case Key$
3890
End Select`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'Select', 'type': ParseTreeTokenType.SELECT, 'children': [
					{'val': 'Case', 'type': ParseTreeTokenType.CASE},
					{'val': '3890', 'type': ParseTreeTokenType.LABEL, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.END_SELECT, 'children': [
						{'val': 'End', 'type': ParseTreeTokenType.END, 'children': []},
						{'val': 'Select', 'type': ParseTreeTokenType.SELECT, 'children': []}
					]}
				]}
			]
		}
	},{
		'code': `Select Case Key$
700 
710 end select`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'Select', 'type': ParseTreeTokenType.SELECT, 'children': [
					{'val': 'Case', 'type': ParseTreeTokenType.CASE},
					{'val': '700', 'type': ParseTreeTokenType.LABEL, 'children': []},
					{'val': '710', 'type': ParseTreeTokenType.LABEL, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.END_SELECT}
				]}
			]}
	},{
		'code': `FOR x = 1 TO w STEP 1 / XDist
770 
NEXT`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'FOR', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'TO'},
					{'val': 'STEP', 'children': [
						{'val': '/', 'type': ParseTreeTokenType.BINARY_OPERATOR}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '770', 'type': ParseTreeTokenType.LABEL, 'children': []},
					]},
					{'val': 'NEXT', 'type': ParseTreeTokenType.NEXT, 'children': []},
				]}
			]}
	},{
		'code': `x = TIMER  ' comment
2220`,
		'numTopChildren': 2,
		'treeInfo': {
			'children': [
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL,
					'children': [
						{'val': 'TIMER', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []}
					]},
				]},
				{'val': '2220', 'type': ParseTreeTokenType.LABEL, 'children': []}
			]
		}
	},{
		'code': `INPUT A
123`,
		'numTopChildren': 2,
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'INPUT', 'children': []},
					{'val': null, 'children': [
						{'val': 'A', 'children': []}
					]}
				]},
				{'val': '123', 'type': ParseTreeTokenType.LABEL, 'children': []}
		]}
	}];
	processParseTestCases(cases, logger);
};