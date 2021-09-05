import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseArraySubscript(logger) {
	const cases = [
	{
		'code': '[4]',
		'numTopChildren': 1, 'numComments': 0,
		'children': [
			{'val': null,
			'type': ParseTreeTokenType.ARRAY_SUBSCRIPT,
			'children': [
				{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET, 'children': []},
				{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
				{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET, 'children': []},
			]
			}
		]
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);	
}