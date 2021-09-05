import { parse } from
'../../../modules/parsing/css/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/css/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from '../../helpers/parsing/processParseTestCases.js';

export function testParseRGB(logger) {
	const cases = [
	{'code': 'rgb(1 2 3)', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': wrapSingleTreeInfoObject({
			'val': null, 'children': [
				{'val': 'rgb', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
					{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
					{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
				]}
			]})
	},
	{'code': 'rgb(1,2,3)', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': wrapSingleTreeInfoObject({
			'val': null, 'children': [
				{'val': 'rgb', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
					{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
					{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					{'val': ',', 'type': ParseTreeTokenType.COMMA},
					{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					{'val': ',', 'type': ParseTreeTokenType.COMMA},
					{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
				]}
			]})
	},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};