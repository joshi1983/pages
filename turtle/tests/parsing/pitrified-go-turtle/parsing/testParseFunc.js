import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseFunc(logger) {
	const cases = [
		{'code': 'func(i interface{}) {}',
			'treeInfo': {
			'children': [
				{'val': 'func', 'type': ParseTreeTokenType.FUNC, 'children': [
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST,
						'children': [
							{'val': '(', 'children': []},
							{'val': 'i'},
							{'val': ')', 'children': []}
						]
					},
					{'val': null, 'children': [
						{'val': '{', 'children': []},
						{'val': '}', 'children': []}
					]}
				]}
			]
		}
		}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};