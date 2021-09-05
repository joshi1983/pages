import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseUnaryOperator(logger) {
	const cases = [
	{'code': '!x', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '!',
				'type': ParseTreeTokenType.UNARY_OPERATOR,
				'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
				]
				}
			]
	}}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};