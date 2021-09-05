import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseCurvedBracketExpression(logger) {
	const cases = [
		{'code': '(checkInfo2[1][i])', 'numTopChildren': 1},
		{'code': '(checkInfo1 !== checkInfo2[1][i])', 'numTopChildren': 1},
		{'code': '(data[checkInfo1[0] + i] !== checkInfo2[1][i])', 'numTopChildren': 1},
		{'code': '(let)', 'numTopChildren': 1,
		'treeInfo': wrapSingleTreeInfoObject({
			'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
			'children': [
				{'val': '(', 'children': []},
				{'val': 'let', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
				{'val': ')', 'children': []}
			]})
		},
		{'code': '(let+3)', 'numTopChildren': 1,
		'treeInfo': wrapSingleTreeInfoObject({
			'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
			'children': [
				{'val': '(', 'children': []},
				{'val': '+', 'children': [
					{'val': 'let', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
				]},
				{'val': ')', 'children': []}
			]})
		}
	];
	processParseTestCases(cases, logger);
};