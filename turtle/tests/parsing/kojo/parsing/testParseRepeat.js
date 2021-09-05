import { parse } from
'../../../../modules/parsing/kojo/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/kojo/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseRepeat(logger) {
	const cases = [
		{'code': 'repeat(3) {',
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
					{'val': 'repeat', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': '3', 'children': []},
						{'val': ')', 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []}
					]},
				]}
			]}
		},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
}