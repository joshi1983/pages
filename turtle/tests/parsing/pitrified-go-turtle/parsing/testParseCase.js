import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseCase(logger) {
	const cases = [
	{
		'code': 'case 1:',
		'treeInfo': {
			'children': [
				{'val': 'case', 'type': ParseTreeTokenType.CASE, 'children': [
					{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []}
				]}
			]
		}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);	
}