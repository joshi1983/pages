import { parse } from
'../../../../modules/parsing/kojo/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/kojo/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseFuncCall(logger) {
	const cases = [
	{
		'code': 'clear',
		'treeInfo': {
			'children': [
				{'val': 'clear', 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []}
				]}
			]
		}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);	
}