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
		},
		{'code': 'class Complex(val real : Double',
		'treeInfo': {
			'children': [
				{'val': 'class', 'type': ParseTreeTokenType.CLASS, 'children': [
					{'val': 'Complex', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': 'val', 'type': ParseTreeTokenType.VAL, 'children': [
							{'val': 'real', 'type': ParseTreeTokenType.IDENTIFIER, 'children': [
								{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': [
									{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
										{'val': 'Double', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
									]}
								]}
							]}
						]}
					]}
				]}
			]}
		}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
}