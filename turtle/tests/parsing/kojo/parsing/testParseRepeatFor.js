import { parse } from
'../../../../modules/parsing/kojo/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/kojo/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseRepeatFor(logger) {
	const cases = [
		{'code': 'repeatFor(1 to 3) {',
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
					{'val': 'repeatFor', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': 'to', 'children': [
							{'val': '1', 'children': []},
							{'val': '3', 'children': []}
						]},
						{'val': ')', 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []}
					]},
				]}
			]}
		},
		{'code': 'repeatFor(x until y) {',
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
					{'val': 'repeatFor', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': 'until', 'children': [
							{'val': 'x', 'children': []},
							{'val': 'y', 'children': []}
						]},
						{'val': ')', 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []}
					]},
				]}
			]}
		},
		{'code': 'repeatFor(0 to 30 by 2) {',
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
					{'val': 'repeatFor', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': 'to', 'children': [
							{'val': '0', 'children': []},
							{'val': 'by', 'children': [
								{'val': '30', 'children': []},
								{'val': '2', 'children': []}
							]}
						]},
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