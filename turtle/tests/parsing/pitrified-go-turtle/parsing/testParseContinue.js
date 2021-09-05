import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseContinue(logger) {
	const cases = [
	{'code': 'for {continue}', 'treeInfo': {
			'children': [
				{'val': 'for',
				'type': ParseTreeTokenType.FOR,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []},
						{'val': 'continue', 'type': ParseTreeTokenType.CONTINUE,
						'children': []},
						{'val': '}', 'children': []}
					]},
				]
				}
			]
	}},
	{'code': 'for {continue f()}', 'treeInfo': {
			'children': [
				{'val': 'for',
				'type': ParseTreeTokenType.FOR,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []},
						{'val': 'continue', 'type': ParseTreeTokenType.CONTINUE,
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