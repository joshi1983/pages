import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

/*
Note that there is also a testParseIf for test cases that don't involve elseif.
*/
export function testParseElseif(logger) {
	const cases = [{
		'code': `IF 1 THEN
ELSEIF 1 Then
END IF`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'IF', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
					{'val': 'THEN', 'type': ParseTreeTokenType.THEN},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': 'ELSEIF', 'type': ParseTreeTokenType.ELSEIF, 'children': [
						{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
						{'val': 'Then', 'type': ParseTreeTokenType.THEN, 'children': [
							{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
						]},
					]},
					{'val': null, 'type': ParseTreeTokenType.END_IF, 'children': [
						{'val': 'END'},
						{'val': 'IF'}
					]}
				]},
			]
		}
	},{
		'code': `IF 1 THEN
ELSEIF 1 Then
	print "hi"
END IF
print "yo"`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'IF', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
					{'val': 'THEN', 'type': ParseTreeTokenType.THEN},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': 'ELSEIF', 'type': ParseTreeTokenType.ELSEIF, 'children': [
						{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
						{'val': 'Then', 'type': ParseTreeTokenType.THEN, 'children': [
							{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
								{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
									{'val': 'print', 'children': []},
									{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
										{'val': '"hi"'}
									]}
								]}
							]},
						]},
					]},
					{'val': null, 'type': ParseTreeTokenType.END_IF, 'children': [
						{'val': 'END'},
						{'val': 'IF'}
					]}
				]},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'print', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '"yo"'}
					]}
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};