import { ParseTreeTokenType } from '../../../modules/parsing/processing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseNew(logger) {
	const cases = [
	{'code': 'new A[4]', 'numTopChildren': 1,  'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.NEW,
		'val': 'new',
		'children': [
			{'type': ParseTreeTokenType.ARRAY_INSTANCE_EXPRESSION, 'children': [
				{'type': ParseTreeTokenType.IDENTIFIER, 'val': 'A', 'children': []},
				{'val': null, 'type': ParseTreeTokenType.INDEX_EXPRESSION, 'children': [
					{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET},
					{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET}
				]}
			]}
		]
		})
	},
	{'code': 'new int[4]', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.NEW,
		'val': 'new',
		'children': [
			{'type': ParseTreeTokenType.ARRAY_INSTANCE_EXPRESSION, 'children': [
				{'type': ParseTreeTokenType.IDENTIFIER, 'val': 'int', 'children': []},
				{'val': null, 'type': ParseTreeTokenType.INDEX_EXPRESSION, 'children': [
					{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET},
					{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET}
				]}
			]}
		]
		})
	},
	{'code': 'new A[4][5]', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.NEW,
		'val': 'new',
		'children': [
			{'type': ParseTreeTokenType.ARRAY_INSTANCE_EXPRESSION, 'children': [
				{'type': ParseTreeTokenType.IDENTIFIER, 'val': 'A', 'children': []},
				{'val': null, 'type': ParseTreeTokenType.INDEX_EXPRESSION, 'children': [
					{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET},
					{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET}
				]},
				{'val': null, 'type': ParseTreeTokenType.INDEX_EXPRESSION, 'children': [
					{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET},
					{'val': '5', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET}
				]}
			]}
		]
		})}
	];
	processParseTestCases(cases, logger);
};