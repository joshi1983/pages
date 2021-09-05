import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseConstDeclarationList(logger) {
	const cases = [
	{
		'code': 'const (',
		'treeInfo': {
			'children': [
				{'val': 'const', 'type': ParseTreeTokenType.CONST, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CONST_DECLARATION_LIST, 'children': [
						{'val': '(', 'children': []}
					]}
				]}
			]
		}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};