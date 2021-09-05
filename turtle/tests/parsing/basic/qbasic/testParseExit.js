import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseExit(logger) {
	const cases = [{
		'code': `j = 30
FOR i = 1 TO 50
  IF i = j THEN
    EXIT FOR
  END IF
NEXT i`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
					{'val': 'j'},
					{'val': '30'}
				]},
				{'val': 'FOR', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'TO', 'children': [
						{'val': '=', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': 'i', 'type': ParseTreeTokenType.IDENTIFIER},
							{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]},
						{'val': '50', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'IF', 'type': ParseTreeTokenType.IF, 'children': [
							{'val': '=', 'children': [
								{'val': 'i'},
								{'val': 'j'}
							]},
							{'val': 'THEN'},
							{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
								{'val': 'EXIT', 'type': ParseTreeTokenType.EXIT, 'children': [
									{'val': 'FOR', 'type': ParseTreeTokenType.FOR, 'children': []}
								]}
							]},
							{'val': null, 'type': ParseTreeTokenType.END_IF}
						]}
					]},
					{'val': 'NEXT', 'type': ParseTreeTokenType.NEXT, 'children': [
						{'val': 'i'},
					]}
				]},
			]
		}
	},{
		'code': `while 1
	print "hi"
	EXIT WHILE
wend`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'while', 'type': ParseTreeTokenType.WHILE, 'children': [
					{'val': '1', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': 'print'},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
								{'val': '"hi"'}
							]}
						]},
						{'val': 'EXIT', 'type': ParseTreeTokenType.EXIT, 'children': [
							{'val': 'WHILE', 'type': ParseTreeTokenType.WHILE}
						]}
					]},
					{'val': 'wend', 'type': ParseTreeTokenType.WEND, 'children': []}
				]},
		]}
	},{
		'code': 'exit def',
		'numTopChildren': 1
	},{
		'code': 'exit do',
		'numTopChildren': 1
	},{
		'code': 'exit do\nx',
		'numTopChildren': 2
	},{
		'code': 'exit for',
		'numTopChildren': 1
	},{
		'code': 'exit for\nx',
		'numTopChildren': 2
	},{
		'code': 'exit function',
		'numTopChildren': 1
	},{
		'code': 'exit sub',
		'numTopChildren': 1
	},{
		'code': `exit sub
goto`,
		'numTopChildren': 2,
		'treeInfo': {
			'children': [
				{'val': 'exit', 'children': [
					{'val': 'sub', 'children': []}
				]},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'goto'},
					{'val': null}
				]}
			]
		}
	},{
		'code': `exit sub
print`,
		'numTopChildren': 2
	},{
		'code': `exit sub
x`,
		'numTopChildren': 2
	},{
		'code': `exit sub
end`,
		'numTopChildren': 2
	},
	{
		'code': 'exit while',
		'numTopChildren': 1
	},
	{
		'code': `exit while
x`,
		'numTopChildren': 2
	}
	];
	processParseTestCases(cases, logger);
};