import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseIf(logger) {
	const cases = [{
		'code': `IF i% = 1 THEN
END IF`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'IF', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '=', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': 'i%', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL}
					]},
					{'val': 'THEN', 'type': ParseTreeTokenType.THEN},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.END_IF, 'children': [
						{'val': 'END'},
						{'val': 'IF'}
					]}
				]},
			]
		}
	},{
		'code': `IF i% = 1 THEN
  PRINT "OK"
END IF`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'IF', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '=', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': 'i%', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL}
					]},
					{'val': 'THEN', 'type': ParseTreeTokenType.THEN},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': 'PRINT'},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
								{'val': '"OK"', 'type': ParseTreeTokenType.STRING_LITERAL}
							]}
						]}
					]},
					{'val': null, 'type': ParseTreeTokenType.END_IF, 'children': [
						{'val': 'END'},
						{'val': 'IF'}
					]}
				]},
			]
		}
	},{
		'code': `IF i% = 1 OR i% = 2 THEN
  PRINT "OK"
ELSE
  PRINT "Out of range"
END IF`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'IF', 'children': [
					{'val': 'OR', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': '=', 'type': ParseTreeTokenType.BINARY_OPERATOR},
						{'val': '=', 'type': ParseTreeTokenType.BINARY_OPERATOR},
					]},
					{'val': 'THEN'},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
					{'val': 'ELSE', 'type': ParseTreeTokenType.ELSE, 'children': [
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
							{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
								{'val': 'PRINT', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
								{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
							]}
						]}
					]},
					{'val': null, 'type': ParseTreeTokenType.END_IF}
				]}
			]
		}
	},{
		'code': `IF i% = 1 OR i% = 2 THEN
ELSE
END IF`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'IF', 'children': [
					{'val': 'OR'},
					{'val': 'THEN'},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
					{'val': 'ELSE', 'type': ParseTreeTokenType.ELSE, 'children': [
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
					]},
					{'val': null, 'type': ParseTreeTokenType.END_IF}
				]}
			]
		}
	},{
		'code': `IF i% = 1 THEN
  x=4
END IF`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'IF', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '=', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': 'i%', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL}
					]},
					{'val': 'THEN', 'type': ParseTreeTokenType.THEN},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
							{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
						]}
					]},
					{'val': null, 'type': ParseTreeTokenType.END_IF, 'children': [
						{'val': 'END', 'children': []},
						{'val': 'IF', 'children': []}
					]}
				]},
			]
		}
	},{
		'code': `IF i% = 1 THEN
END IF
print "hi"`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'IF', 'type': ParseTreeTokenType.IF	},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'print'},
					{'val': null}
				]},
			]
		}
	},{
		'code': `IF i% = 1 THEN
END IF
x = 4`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'IF', 'type': ParseTreeTokenType.IF	},
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
					{'val': 'x'},
					{'val': '4'}
				]},
			]
		}
	},{
		'code': `IF 1 THEN
END IF
IF`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'IF', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '1', 'children': []},
					{'val': 'THEN', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
					{'val': null, 'type': ParseTreeTokenType.END_IF, 'children': [
						{'val': 'END', 'children': []},
						{'val': 'IF', 'children': []}
					]}
				]},
				{'val': 'IF', 'children': []},
			]}
	},{
		'code': `If 1 Then Print "Text modes unsupported!": End
If bytesperpixel& = 1 Then`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'If', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '1', 'children': []},
					{'val': 'Then', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
					{'val': null, 'type': ParseTreeTokenType.END_IF, 'children': [
						{'val': 'End', 'children': []}
					]}
				]},
				{'val': 'If', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '=', 'type': ParseTreeTokenType.BINARY_OPERATOR},
					{'val': 'Then', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
				]}
			]}
	}, {
		'code': 'IF 1 THEN PRINT x',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'IF', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
					{'val': 'THEN', 'type': ParseTreeTokenType.THEN, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': null, 'children': [
							{'val': 'PRINT', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
								{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
							]}
						]}
					]},
				]},
			]}
	}, {
		// single line if-statement as documented at:
		// https://github-wiki-see.page/m/QB64Official/qb64/wiki/IF...THEN
		'code': `IF 1 THEN PRINT x
		print y`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'IF', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
					{'val': 'THEN', 'type': ParseTreeTokenType.THEN, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': null, 'children': [
							{'val': 'PRINT', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
								{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
							]}
						]}
					]},
				]},
				{'val': null, 'children': [
					{'val': 'print', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]}
				]}
			]}
	},{
		'code': 'IF f() THEN',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'IF', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
						{'val': 'f', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '('},
							{'val': ')'}
						]}
					]},
					{'val': 'THEN', 'type': ParseTreeTokenType.THEN, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []}
				]}
			]}
	},{
		'code': 'IF 1 THEN x = 159.5: y = 99.5',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'IF', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
					{'val': 'THEN', 'type': ParseTreeTokenType.THEN, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '='},
						{'val': '='},
					]}
				]}
			]}
	},{
		'code': 'IF not x THEN',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'IF', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': 'not', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
						{'val': 'x', 'children': []}
					]},
					{'val': 'THEN', 'type': ParseTreeTokenType.THEN, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []}
				]}
			]}
	},{
		'code': 'IF - x',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'IF', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '-', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
						{'val': 'x', 'children': []}
					]},
				]}
			]}
	},{
		'code': 'ELSEIF - x',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'ELSEIF', 'type': ParseTreeTokenType.ELSEIF, 'children': [
					{'val': '-', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
						{'val': 'x', 'children': []}
					]},
				]}
			]}
	},{
		'code': `Sub SaveImage ()
    If 1 Then padder$ = 4
End Sub`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'Sub', 'type': ParseTreeTokenType.SUB, 'children': [
					{'val': 'SaveImage', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'If', 'children': [
							{'val': '1'},
							{'val': 'Then'},
							{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
								{'val': '='}
							]}
						]}
					]},
					{'val': null, 'type': ParseTreeTokenType.END_SUB, 'children': [
						{'val': 'End'},
						{'val': 'Sub'}
					]}
				]}
		]}
	},{'code': `IF 1 THEN a$ = "10"
IF`,
	'numTopChildren': 2},
{'code': `IF 1 THEN a$ = "10"
IF 1 THEN a$ = "11"`,
	'numTopChildren': 2
	},{'code': `IF 1 THEN a$ = "10"
x`,
	'numTopChildren': 2
	},{'code': `IF 1 THEN a$ = "10"
x()`,
	'numTopChildren': 2},
{'code': `IF true THEN a$ = "10"`,
	'numTopChildren': 1
	},
{'code': `IF false THEN a$ = "10"`,
	'numTopChildren': 1,
	'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'IF', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': 'false', 'type': ParseTreeTokenType.BOOLEAN_LITERAL, 'children': []},
					{'val': 'THEN', 'type': ParseTreeTokenType.THEN, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
				]}
			]
		}
	},
	{'code': `if true then goto 100
	print "hi"`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': 'true', 'type': ParseTreeTokenType.BOOLEAN_LITERAL, 'children': []},
					{'val': 'then', 'type': ParseTreeTokenType.THEN, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
				]},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL}
			]
		}
	},
	{'code': `if 1 THEN
END
end if`, 'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '1', 'children': []},
					{'val': 'THEN'},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': 'END', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []}
						]}
					]},
					{'val': null, 'type': ParseTreeTokenType.END_IF, 'children': [
						{'val': 'end', 'type': ParseTreeTokenType.END, 'children': []},
						{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': []},
					]}
				]}
			]}
	},{
		'code': `if 1 < x
  print`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '<', 'children': [
						{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': 'print', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []}
						]}
					]}
				]}
			]
		}
	},{
		// This would cause a SYNTAX error in QBASIC 1.1 Button
		// we want to parse it a specific way anyway because BBC BASIC 
		// will sometimes translate to code like this.
		'code': `if 1 < x then return
print "hi"`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '<'},
					{'val': 'then'},
					{'val': null}
				]},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'print'},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
				]}
			]}
	},{
		// despite the print being on the same line as return,
		// we want to move the print out of the code block because
		// it makes no sense to return a null.
		// QBASIC return isn't the same as c, c++, Java, JavaScript... return statements.
		// We want to handle return as an optional label like in QBASIC but 
		// also handle it sometimes like a return value anyway, though.
		'code': `if 1 < x then return print "hi"`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '<'},
					{'val': 'then'},
					{'val': null}
				]},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'print'},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
				]}
			]}
	},{
		'code': `if 1 < x then return
x = 3`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '<'},
					{'val': 'then'},
					{'val': null}
				]},
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
					{'val': 'x'},
					{'val': '3'}
				]}
			]}
	}
	];
	processParseTestCases(cases, logger);
};