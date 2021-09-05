import { ParseTreeTokenType } from
'../../../modules/parsing/qbasic/ParseTreeTokenType.js';
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
		'code': 'exit def',
		'numTopChildren': 1
	},{
		'code': 'exit do',
		'numTopChildren': 1
	},{
		'code': 'exit for',
		'numTopChildren': 1
	},{
		'code': 'exit function',
		'numTopChildren': 1
	},{
		'code': 'exit sub',
		'numTopChildren': 1
	}];
	processParseTestCases(cases, logger);
};