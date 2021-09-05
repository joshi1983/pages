import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseFunctionCall(logger) {
	const cases = [
	{
		'code': 'put "hi"',
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'put', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '"hi"', 'type': ParseTreeTokenType.STRING_LITERAL, 'children': []},
					]}
				]}
			]
		}
	},{
		'code': 'f("hi")',
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'f', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET, 'children': []},
						{'val': '"hi"', 'type': ParseTreeTokenType.STRING_LITERAL, 'children': []},
						{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET, 'children': []},
					]}
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};