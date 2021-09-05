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
				{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
					{'val': 'clear', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []}
				]}
			]
		}
	},
	{
		'code': 'math.cos',
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
						{'val': 'math', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': []},
						{'val': 'cos', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
					]}
				]}
			]
		}
	},
	{
		'code': 'math.cos(1)',
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
						{'val': 'math', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': []},
						{'val': 'cos', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET, 'children': []},
						{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
						{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET, 'children': []},
					]}
				]}
			]
		}
	},
	{
		'code': 'clear()\nmath.cos(1)',
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
					{'val': 'clear', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': ')', 'children': []}
					]}
				]},
				{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
						{'val': 'math', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': []},
						{'val': 'cos', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET, 'children': []},
						{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
						{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET, 'children': []},
					]}
				]}
			]
		}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);	
}