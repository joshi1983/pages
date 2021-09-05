import { ParseTreeTokenType } from
'../../../modules/parsing/qbasic/ParseTreeTokenType.js';
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
	}];
	processParseTestCases(cases, logger);
};