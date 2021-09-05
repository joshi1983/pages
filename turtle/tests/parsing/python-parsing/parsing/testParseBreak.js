import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseBreak(logger) {
	const cases = [
	{
		'code': 'while True:\n\tbreak\nx',
		'numTopChildren': 2,
		'treeInfo': {
			'children': [{
				'val': 'while',
				'type': ParseTreeTokenType.WHILE_LOOP,
				'children': [
					{'val': 'True', 'children': []},
					{'val': ':', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'break', 'type': ParseTreeTokenType.BREAK, 'children': []}
					]},
				]},
				{'val': 'x', 'children': []}
			]
		}
	}
	];
	processParseTestCases(cases, logger);
};