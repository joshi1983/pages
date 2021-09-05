import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseDefer(logger) {
	const cases = [
	{
		'code': 'defer f()',
		'treeInfo': {
			'children': [
				{'val': 'defer', 'type': ParseTreeTokenType.DEFER, 'children': [
					{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
						{'val': 'f', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '(', 'children': []},
							{'val': ')', 'children': []}
						]}
					]},
				]}
			]
		}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);	
}