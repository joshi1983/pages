import { parse } from
'../../../../modules/parsing/kojo/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/kojo/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseNew(logger) {
	const cases = [
	{
		'code': 'new',
		'treeInfo': {
			'children': [
				{'val': 'new', 'type': ParseTreeTokenType.NEW, 'children': [
				]}
			]
		}
	},
	{
		'code': 'new Turtle',
		'treeInfo': {
			'children': [
				{'val': 'new', 'type': ParseTreeTokenType.NEW, 'children': [
					{'val': 'Turtle', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		}
	},
	{
		'code': 'new Turtle()',
		'treeInfo': {
			'children': [
				{'val': 'new', 'type': ParseTreeTokenType.NEW, 'children': [
					{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
						{'val': 'Turtle', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '(', 'children': []},
							{'val': ')', 'children': []}
						]}
					]}
				]}
			]
		}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);	
}