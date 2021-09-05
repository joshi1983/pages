import { parse } from
'../../../../modules/parsing/kojo/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/kojo/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseClass(logger) {
	const cases = [
		{'code': 'class A',
		'treeInfo': {
			'children': [
				{'val': 'class', 'type': ParseTreeTokenType.CLASS, 'children': [
					{'val': 'A', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]}
		},
		{'code': 'class Point(',
		'treeInfo': {
			'children': [
				{'val': 'class', 'type': ParseTreeTokenType.CLASS, 'children': [
					{'val': 'Point', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'children': []}
					]}
				]}
			]}
		}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
}