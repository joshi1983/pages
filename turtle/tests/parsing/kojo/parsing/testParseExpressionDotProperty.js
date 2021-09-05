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
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
}