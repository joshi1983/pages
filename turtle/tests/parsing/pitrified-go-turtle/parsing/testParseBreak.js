import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseBreak(logger) {
	const cases = [
	{'code': 'for {break}', 'treeInfo': {
			'children': [
				{'val': 'for',
				'type': ParseTreeTokenType.FOR,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []},
						{'val': 'break', 'type': ParseTreeTokenType.BREAK,
						'children': []},
						{'val': '}', 'children': []}
					]},
				]
				}
			]
	}},
	{'code': 'for {break f()}', 'treeInfo': {
			'children': [
				{'val': 'for',
				'type': ParseTreeTokenType.FOR,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []},
						{'val': 'break', 'type': ParseTreeTokenType.BREAK,
						'children': []},
						{'val': null, 'children': [
							{'val': 'f', 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
						]},
						{'val': '}', 'children': []}
					]},
				]
				}
			]
	}}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};