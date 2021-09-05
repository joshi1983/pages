import { ParseTreeTokenType } from
'../../../modules/parsing/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseGoto(logger) {
	const cases = [{
		'code': `Start:
  PRINT "i ="; i
  GOTO Start
`,
		'numTopChildren': 3,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'Start', 'type': ParseTreeTokenType.LABEL, 'children': []},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'PRINT', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '"i ="', 'children': []},
						{'val': ';'},
						{'val': 'i'}
					]}
				]},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'GOTO', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': 'Start'}
					]}
				]},
			]
		}
	},{
		'code': `1 PRINT "i ="; i
  GOTO 1
`,
		'numTopChildren': 3,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '1', 'type': ParseTreeTokenType.LABEL, 'children': []},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'PRINT', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '"i ="', 'children': []},
						{'val': ';'},
						{'val': 'i'}
					]}
				]},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'GOTO', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '1'}
					]}
				]},
			]
		}
	}];
	processParseTestCases(cases, logger);
};