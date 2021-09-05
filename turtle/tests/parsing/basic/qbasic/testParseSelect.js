import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseSelect(logger) {
	const cases = [{
		'code': `SELECT CASE Total
  CASE IS >= 5
	PRINT "Greater than or equal to 5"

  CASE 2 TO 4
	PRINT "Moderate"

  CASE ELSE
	  PRINT "Something else"

END SELECT`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'SELECT', 'type': ParseTreeTokenType.SELECT, 'children': [
					{'val': 'CASE', 'type': ParseTreeTokenType.CASE, 'children': [
						{'val': 'Total', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]},
					{'val': 'CASE', 'type': ParseTreeTokenType.CASE,
						'children': [
						{'val': '>=', 'children': [
							{'val': 'IS'},
							{'val': '5'}
						]},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
					]},
					{'val': 'CASE', 'type': ParseTreeTokenType.CASE,
					'children': [
						{'val': 'TO', 'children': [
							{'val': '2'},
							{'val': '4'}
						]},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
					]},
					{'val': 'CASE', 'type': ParseTreeTokenType.CASE, 'children': [
						{'val': 'ELSE'},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
					]},
					{'val': null, 'type': ParseTreeTokenType.END_SELECT, 'children': [
						{'val': 'END'},
						{'val': 'SELECT'}
					]}
				]},
			]
		}
	},{
		'code': `SELECT CASE Total
		END SELECT
		SELECT`,
		'numTopChildren': 2
	},{
		'code': `SELECT CASE r
END SELECT
nx`,
		'numTopChildren': 2
	},{
		'code': `SELECT CASE r
END SELECT
nx = 5`,
		'numTopChildren': 2
	},{
		'code': `SELECT CASE num
    CASE 5 TO 9: 
		print "hi"`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'SELECT', 'type': ParseTreeTokenType.SELECT, 'children': [
					{'val': 'CASE', 'type': ParseTreeTokenType.CASE, 'children': [
						{'val': 'num', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]},
					{'val': 'CASE', 'type': ParseTreeTokenType.CASE,
						'children': [
							{'val': 'TO', 'children': [
								{'val': '5', 'children': []},
								{'val': '9', 'children': []},
							]},
							{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
								{
									'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
										{'val': 'print', 'children': []},
										{'val': null, 'children': [
											{'val': '"hi"', 'type': ParseTreeTokenType.STRING_LITERAL, 'children': []}
										]}
									]
								}
							]}
						]
					},
				]}
			]}
	},{
		'code': `Select Case x
        Case "F"
            If 2 Then
                If 1 Then
                    Paint (3, 4), linecolor
                End If
end if
end select`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'Select', 'type': ParseTreeTokenType.SELECT, 'children': [
					{'val': 'Case', 'type': ParseTreeTokenType.CASE, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER}
					]},
					{'val': 'Case', 'type': ParseTreeTokenType.CASE, 'children': [
						{'val': '"F"'},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
							{'val': 'If', 'children': [
								{'val': '2', 'children': []},
								{'val': 'Then', 'children': []},
								{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
									{'val': 'If', 'type': ParseTreeTokenType.IF, 'children': [
										{'val': '1', 'children': []},
										{'val': 'Then', 'children': []},
										{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
											{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
												{'val': 'Paint', 'children': []},
												{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
													{'val': null, 'type': ParseTreeTokenType.TUPLE_LITERAL},
													{'val': ',', 'children': []},
													{'val': 'linecolor', 'children': []}
												]}
											]},
										]},
										{'val': null, 'type': ParseTreeTokenType.END_IF}
									]}
								]},
								{'val': null, 'type': ParseTreeTokenType.END_IF}
							]}
						]}
					]},
					{'val': null, 'type': ParseTreeTokenType.END_SELECT}
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};