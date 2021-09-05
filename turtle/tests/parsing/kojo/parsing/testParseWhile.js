import { parse } from
'../../../../modules/parsing/kojo/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/kojo/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseWhile(logger) {
	const cases = [
		{'code': 'while (',
		'treeInfo': {
			'children': [
				{'val': 'while', 'type': ParseTreeTokenType.WHILE, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
						{'val': '(', 'children': []},
					]}
				]}
			]}
		},
		{'code': 'while ( x < 19) {',
		'treeInfo': {
			'children': [
				{'val': 'while', 'type': ParseTreeTokenType.WHILE, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
				]}
			]}
		},
		{'code': 'while ( true) {} x',
		'treeInfo': {
			'children': [
				{'val': 'while', 'type': ParseTreeTokenType.WHILE, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []},
						{'val': '}', 'children': []}
					]}
				]},
				{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
			]}
		},
		{'code': 'while ( true) {} if',
		'treeInfo': {
			'children': [
				{'val': 'while', 'type': ParseTreeTokenType.WHILE, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []},
						{'val': '}', 'children': []}
					]}
				]},
				{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': []},
			]}
		}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
}