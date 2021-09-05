import { parse } from
'../../../../modules/parsing/kojo/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/kojo/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseTrait(logger) {
	const cases = [
		{'code': 'trait A',
		'treeInfo': {
			'children': [
				{'val': 'trait', 'type': ParseTreeTokenType.TRAIT, 'children': [
					{'val': 'A', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]}
		},
		{'code': 'trait A extends B {',
		'treeInfo': {
			'children': [
				{'val': 'trait', 'type': ParseTreeTokenType.TRAIT, 'children': [
					{'val': 'A', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': 'extends', 'type': ParseTreeTokenType.EXTENDS, 'children': [
						{'val': 'B', 'children': []}
					]},
					{'val': null, 'children': [
						{'val': '{', 'children': []}
					]}
				]}
			]}
		}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
}