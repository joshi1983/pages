import { parse } from
'../../../../modules/parsing/kojo/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/kojo/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseFor(logger) {
	const cases = [
		{'code': 'for (',
		'treeInfo': {
			'children': [
				{'val': 'for', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': null, 'type': ParseTreeTokenType.FOR_LOOP_SETTINGS, 'children': [
						{'val': '(', 'children': []},
					]},
				]}
			]}
		},
		{'code': 'for (p <- people) println(p)',
		'treeInfo': {
			'children': [
				{'val': 'for', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': null, 'type': ParseTreeTokenType.FOR_LOOP_SETTINGS, 'children': [
						{'val': '(', 'children': []},
						{'val': '<-', 'children': [
							{'val': 'p', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': 'people', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
						]},
						{'val': ')', 'children': []},
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
							{'val': 'println', 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
						]}
					]}
				]}
			]}
		}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
}