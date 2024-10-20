import { ParseTreeTokenType } from '../../../modules/parsing/processing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseIndexExpressionIndex(logger) {
	const cases = [
	{'code': 'context.valueStack[1]', 'numTopChildren': 1,  'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
		'val': null,
		'children': [
			{'type': ParseTreeTokenType.EXPRESSION_DOT, 'val': null, 'children': [
				{'type': ParseTreeTokenType.IDENTIFIER, 'val': 'context', 'children': []},
				{'type': ParseTreeTokenType.DOT, 'val': '.', 'children': [
					{'type': ParseTreeTokenType.IDENTIFIER, 'val': 'valueStack', 'children': []}
				]}
			]},
			{'val': null, 'type': ParseTreeTokenType.INDEX_EXPRESSION, 'children': [
				{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET},
				{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL},
				{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET}
			]}
		]
		})
	}
	];
	processParseTestCases(cases, logger);
};