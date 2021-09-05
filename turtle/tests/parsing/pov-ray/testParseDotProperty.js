import { parse } from
'../../../modules/parsing/pov-ray/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/pov-ray/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseDotProperty(logger) {
	const cases = [
	{'code': '#declare Answer = Fnord.Foo',
'numTopChildren': 1, 'numComments': 0,
'treeInfo': {
	'children': [
		{'val': '#declare',
		'children': [
			{'val': '=', 'children': [
				{'val': 'Answer'},
				{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY,
				'children': [
					{'val': 'Fnord', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': '.', 'type': ParseTreeTokenType.DOT},
					{'val': 'Foo', 'type': ParseTreeTokenType.IDENTIFIER}
				]}
			]}
		]}
	]
}}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};