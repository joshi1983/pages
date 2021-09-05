import { ParseTreeTokenType } from '../../../modules/parsing/processing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseExpressions(logger) {
	const cases = [
		{'code': '', 'numTopChildren': 0, 'maxDepth': 1},
		{'code': ';', 'numTopChildren': 1, 'maxDepth': 2},
		{'code': '4', 'numTopChildren': 1, 'maxDepth': 2},
		{'code': '(4)', 'numTopChildren': 1, 'maxDepth': 3},
		{'code': '4;', 'numTopChildren': 2, 'maxDepth': 2},
		{'code': 'true', 'numTopChildren': 1, 'maxDepth': 2, 'treeInfo': wrapSingleTreeInfoObject({
			'val': 'true',
			'type': ParseTreeTokenType.BOOLEAN_LITERAL
		})},
		{'code': 'false', 'numTopChildren': 1, 'maxDepth': 2, 'treeInfo': wrapSingleTreeInfoObject({
			'val': 'false',
			'type': ParseTreeTokenType.BOOLEAN_LITERAL
		})},
		{'code': '!true', 'numTopChildren': 1, 'maxDepth': 3},
		{'code': 'obj[3].rgb', 'numTopChildren': 1},
		{'code': 'i++', 'numTopChildren': 1, 'maxDepth': 3, 'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'children': [{
					'type': ParseTreeTokenType.IDENTIFIER,
					'val': 'i',
					'children': [
						{'type': ParseTreeTokenType.UNARY_OPERATOR, 'val': '++'}
					]
				}]
		}},
		{'code': '++i', 'numTopChildren': 1, 'maxDepth': 3, 'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'children': [{
					'type': ParseTreeTokenType.UNARY_OPERATOR,
					'val': '++',
					'children': [
						{'type': ParseTreeTokenType.IDENTIFIER, 'val': 'i'}
					]
				}]
		}},
	];
	processParseTestCases(cases, logger);
};