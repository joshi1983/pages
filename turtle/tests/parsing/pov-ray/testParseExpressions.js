import { parse } from
'../../../modules/parsing/pov-ray/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/pov-ray/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseExpressions(logger) {
	const cases = [
	{'code': '3.14', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '3.14', 'type': ParseTreeTokenType.NUMBER_LITERAL}
			]}
	},
	{'code': '[-3.14,4]', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION,
				'children': [
					{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET},
					{'val': '-3.14', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					{'val': ',', 'type': ParseTreeTokenType.COMMA},
					{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET}
				]}
			]}
	},
	{'code': 'x[3]', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'children': [
			{"val": null, "type": ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
			"children": [
				{"val": "x", "type": ParseTreeTokenType.IDENTIFIER},
				{"val": null, "type": ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION,
				"children": [
					{"val": "["},
					{"val": "3"},
					{"val": "]"},
				]}
			]},
		]
	}}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};