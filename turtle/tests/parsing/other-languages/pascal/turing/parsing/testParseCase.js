import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseCase(logger) {
	const cases = [
	{
		'code': 'case x',
		'treeInfo': {
			'children': [
				{'val': 'case', 'type': ParseTreeTokenType.CASE, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		}
	},
	{
		'code': 'case x of',
		'treeInfo': {
			'children': [
				{'val': 'case', 'type': ParseTreeTokenType.CASE, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': 'of', 'type': ParseTreeTokenType.OF, 'children': []}
				]}
			]
		}
	},{
		'code': 'case x of\nend case',
		'treeInfo': {
			'children': [
				{'val': 'case', 'type': ParseTreeTokenType.CASE, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': 'of', 'type': ParseTreeTokenType.OF, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.END_CASE, 'children': [
						{'val': 'end', 'children': []},
						{'val': 'case', 'children': []}
					]}
				]}
			]
		}
	},{
		'code': 'case x of\nend case put "hello"',
		'numTopChildren': 2
	},{
		'code': 'case x of\nend case for',
		'numTopChildren': 2
	},{
		'code': 'case x of\nend case loop',
		'numTopChildren': 2
	},{
		'code': 'case x of\nend case if',
		'numTopChildren': 2
	}];
	processParseTestCases(cases, logger);
};