import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseSubroutines(logger) {
	const cases = [{
		'code': `SUB name (params)
END SUB`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'SUB', 'type': ParseTreeTokenType.SUB, 'children': [
					{'val': 'name', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '('},
						{'val': 'params'},
						{'val': ')'},
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.END_SUB, 'children': [
						{'val': 'END'},
						{'val': 'SUB'}
					]}
				]},
			]
		}
	},{
		'code': `sub Set()
end sub

SELECT`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'sub', 'type': ParseTreeTokenType.SUB, 'children': [
					{'val': 'Set', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
					{'val': null, 'type': ParseTreeTokenType.END_SUB, 'children': [
						{'val': 'end', 'type': ParseTreeTokenType.END, 'children': []},
						{'val': 'sub', 'type': ParseTreeTokenType.SUB, 'children': []}
					]}
				]},
				{'val': 'SELECT', 'type': ParseTreeTokenType.SELECT}
			]}
	},{
		'code': 'SUB s1 (snake(',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'SUB', 'type': ParseTreeTokenType.SUB, 'children': [
					{'val': 's1', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': 'snake', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': null, 'children': [
							{'val': '(', 'children': []}
						]}
					]}
				]}
			]
		}
	},{
		'code': 'SUB s1 (snake() as',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'SUB', 'type': ParseTreeTokenType.SUB, 'children': [
					{'val': 's1', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': 'snake', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': null, 'children': [
							{'val': '(', 'children': []},
							{'val': ')', 'children': []}
						]},
						{'val': 'as', 'type': ParseTreeTokenType.AS},
					]}
				]}
			]
		}
	},{
		'code': `SUB sub1
FOR`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'SUB', 'type': ParseTreeTokenType.SUB, 'children': [
					{'val': 'sub1', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
				]}
		]}
	},{
		'code': `SUB sub1
FOR y = 1 TO 14
NEXT y
END SUB`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'SUB', 'type': ParseTreeTokenType.SUB, 'children': [
					{'val': 'sub1', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
					{'val': null, 'type': ParseTreeTokenType.END_SUB, 'children': [
						{'val': 'END'},
						{'val': 'SUB'}
					]}
				]}
		]}
	},{
		'code': `SUB sub1 ()
    SELECT CASE x
    END SELECT
END SUB`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'SUB', 'type': ParseTreeTokenType.SUB, 'children': [
					{'val': 'sub1', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '('},
						{'val': ')'}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'SELECT', 'children': [
							{'val': 'CASE', 'children': [
								{'val': 'x', 'children': []}
							]},
							{'val': null, 'children': [
								{'val': 'END', 'children': []},
								{'val': 'SELECT', 'children': []}
							]}
						]}
					]},
					{'val': null, 'type': ParseTreeTokenType.END_SUB, 'children': [
						{'val': 'END', 'children': []},
						{'val': 'SUB', 'children': []}
					]}
				]}
		]}
	},{
		'code': `SUB PROCtri (s, x)
	PROCtri s, x2
END SUB`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'SUB', 'type': ParseTreeTokenType.SUB, 'children': [
					{'val': 'PROCtri', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': 's', 'children': []},
						{'val': ',', 'children': []},
						{'val': 'x', 'children': []},
						{'val': ')', 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': 'PROCtri', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
								{'val': 's', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
								{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
								{'val': 'x2', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
							]}
						]},
					]},
					{'val': null, 'children': [
						{'val': 'END', 'children': []},
						{'val': 'SUB', 'children': []}
					]}
				]}
		]}
	}];
	processParseTestCases(cases, logger);
};