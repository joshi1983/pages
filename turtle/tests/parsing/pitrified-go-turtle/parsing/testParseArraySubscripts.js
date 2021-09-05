import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseArraySubscripts(logger) {
	const cases = [
	{
		'code': '[4][]',
		'numTopChildren': 1, 'numComments': 0,
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.ARRAY_LITERAL, 'children': [
					{'val': null, 'type': ParseTreeTokenType.ARRAY_SUBSCRIPTS, 'children': [
						{'val': null,
						'type': ParseTreeTokenType.ARRAY_SUBSCRIPT,
						'children': [
							{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET, 'children': []},
							{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
							{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET, 'children': []},
						]
						},
						{'val': null, 'type': ParseTreeTokenType.ARRAY_SUBSCRIPT, 'children': [
							{'val': '[', 'children': []},
							{'val': ']', 'children': []}
						]},
					]}
				]}
			]
		}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);	
}