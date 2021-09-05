import { parse } from
'../../../modules/parsing/pov-ray/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/pov-ray/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseUnaryOperators(logger) {
	const cases = [
	{'code': '-x', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'children': [
			{'val': '-', 'type': ParseTreeTokenType.UNARY_OPERATOR,
			'children': [
				{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER}
			]}
		]
	}},
	{'code': '+x', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'children': [
			{'val': '+', 'type': ParseTreeTokenType.UNARY_OPERATOR,
			'children': [
				{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER}
			]}
		]
	}},
	{'code': '#local x = +y', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'children': [
			{'val': '#local', 'type': ParseTreeTokenType.LOCAL,
			'children': [
				{'val': '=', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': '+', 'type': ParseTreeTokenType.UNARY_OPERATOR,
					'children': [
						{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER}
					]}
				]}
			]}
		]
	}}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};