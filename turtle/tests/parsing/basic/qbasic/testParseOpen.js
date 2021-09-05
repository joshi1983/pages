import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseOpen(logger) {
	const cases = [{
		'code': 'OPEN "TEST.DAT" FOR INPUT AS #1',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'OPEN', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '"TEST.DAT"', 'type': ParseTreeTokenType.STRING_LITERAL, 'children': []},
						{'val': 'FOR', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': 'INPUT', 'children': []},
						{'val': 'AS', 'children': [
							{'val': '#1', 'children': []}
						]},
					]}
				]}
			]}
		},
		{
			'code': 'Open filename$ +',
			'parseSettings': {
				'skipScanTokenSanitization': true
			},
			'numTopChildren': 1,
			'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
						{'val': 'Open', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '+', 'children': [
								{'val': 'filename$', 'children': []}
							]}
						]}
					]}
			]}
		},
		{
			'code': 'OPEN n$ FOR INPUT AS #1',
			'numTopChildren': 1
		},
		{
			'code': 'Open filename$ + ext$ For',
			'numTopChildren': 1
		},
		{
			'code': 'Open filename$ + ext$ For Output As',
			'numTopChildren': 1
		}
	];
	processParseTestCases(cases, logger);
};