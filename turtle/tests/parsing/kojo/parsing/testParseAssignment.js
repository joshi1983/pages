import { parse } from
'../../../../modules/parsing/kojo/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/kojo/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseAssignment(logger) {
	const cases = [
		{'code': 'val n = 19',
		'treeInfo': {
			'children': [
				{'val': 'val', 'type': ParseTreeTokenType.VAL, 'children': [
					{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
						{'val': 'n', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': '19', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]}
				]}
			]}
		},
		{'code': 'p.x = 19',
		'treeInfo': {
			'children': [
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
						{'val': 'p', 'children': []},
						{'val': '.', 'children': []},
						{'val': 'x', 'children': []}
					]},
					{'val': '19', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
				]}
			]}
		},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
}