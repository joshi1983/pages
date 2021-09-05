import { parse } from
'../../../../modules/parsing/kojo/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/kojo/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseExpressionDotProperty(logger) {
	const cases = [
		{'code': '(1.23).toInt',
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
						{'val': null, 'children': [
							{'val': '(', 'children': []},
							{'val': '1.23', 'children': []},
							{'val': ')', 'children': []}
						]},
						{'val': '.', 'children': []},
						{'val': 'toInt', 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []}
				]}
			]}
		},
		{'code': 'println((1.1).',
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
					{'val': 'println', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
							{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
								{'val': '(', 'children': []},
								{'val': '1.1', 'children': []},
								{'val': ')', 'children': []},
							]},
							{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': []}
						]},
					]}
				]}
			]
		}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
}