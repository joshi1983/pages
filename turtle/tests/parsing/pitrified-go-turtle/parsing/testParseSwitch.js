import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseSwitch(logger) {
	const cases = [
	{
		'code': 'switch which {',
		'treeInfo': {
			'children': [
				{'val': 'switch', 'type': ParseTreeTokenType.SWITCH, 'children': [
					{'val': 'which', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.SWITCH_BLOCK, 'children': [
						{'val': '{', 'children': []}
					]}
				]}
			]
		}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);	
}