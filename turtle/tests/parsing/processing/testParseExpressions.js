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
		{'code': 'obj[3].rgb', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
			'type': ParseTreeTokenType.EXPRESSION_DOT,
			'val': null,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION, 'children': [
					{'val': 'obj', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.INDEX_EXPRESSION, 'children': [
						{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET, 'children': []},
						{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
						{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET, 'children': []},
					]},
				]},
				{'val': '.', 'children': [
					{'val': 'rgb', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		})},
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
		{'code': '++i', 'numTopChildren': 1, 'maxDepth': 3, 'treeInfo': wrapSingleTreeInfoObject({
			'type': ParseTreeTokenType.UNARY_OPERATOR,
			'val': '++',
			'children': [
				{'type': ParseTreeTokenType.IDENTIFIER, 'val': 'i'}
			]
		})},
		{'code': 'new int[3]', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
			'type': ParseTreeTokenType.NEW,
			'val': 'new',
			'children': [
				{'type': ParseTreeTokenType.ARRAY_INSTANCE_EXPRESSION, 'val': null,
				'children': [
					{'val': 'int', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.INDEX_EXPRESSION, 'children': [
						{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET, 'children': []},
						{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
						{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET, 'children': []}
					]}
				]}
			]
		})},
		{'code': 'new package1.A[3]', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
			'type': ParseTreeTokenType.NEW,
			'val': 'new',
			'children': [
				{'type': ParseTreeTokenType.ARRAY_INSTANCE_EXPRESSION, 'val': null,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT, 'children': [
						{'val': 'package1', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
							{'val': 'A', 'children': []},
						]}
						]
					},
					{'val': null, 'type': ParseTreeTokenType.INDEX_EXPRESSION, 'children': [
						{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET, 'children': []},
						{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
						{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET, 'children': []}
					]}
				]}
			]
		})}
	];
	processParseTestCases(cases, logger);
};