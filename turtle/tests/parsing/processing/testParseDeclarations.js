import { ParseTreeTokenType } from '../../../modules/parsing/processing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseDeclarations(logger) {
	const cases = [
		{'code': 'String x = "hi";', 'numTopChildren': 2, 'maxDepth': 4, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DECLARATION, 'children': [
					{'type': ParseTreeTokenType.DATA_TYPE, 'val': 'String', 'children': []},
					{'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'val': '=', 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': '"hi"', 'type': ParseTreeTokenType.STRING_LITERAL, 'children': []}
					]},
				]},
				{'type': ParseTreeTokenType.SEMICOLON, 'val': ';'}
			]
		}},
		{'code': 'int x=4', 'numTopChildren': 1, 'maxDepth': 4, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DECLARATION, 'children': [
					{'type': ParseTreeTokenType.DATA_TYPE, 'val': 'int', 'children': []},
					{'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'val': '=', 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL}
					]}
				]}
			]
		}},
		{'code': 'int x=-4', 'numTopChildren': 1, 'maxDepth': 4, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DECLARATION, 'children': [
					{'type': ParseTreeTokenType.DATA_TYPE, 'val': 'int', 'children': []},
					{'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'val': '=', 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': '-4', 'type': ParseTreeTokenType.NUMBER_LITERAL}
					]}
				]}
			]
		}
		},
		{'code': 'int red = 0, green = 1', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DECLARATION, 'children': [
					{'type': ParseTreeTokenType.DATA_TYPE, 'val': 'int', 'children': []},
					{'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'val': '=', 'children': [
						{'val': 'red', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': '0', 'type': ParseTreeTokenType.NUMBER_LITERAL}
					]},
					{'val': ',', 'type': ParseTreeTokenType.COMMA},
					{'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'val': '=', 'children': [
						{'val': 'green', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL}
					]}
				]}
			]},
		},
		{'code': 'int[] x;', 'numTopChildren': 2, 'maxDepth': 5, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DECLARATION, 'children': [
					{'type': ParseTreeTokenType.DATA_TYPE, 'val': 'int', 'children': [
						{'val': null, 'type': ParseTreeTokenType.ARRAY_DIMENSION_INDICATOR, 'children': [
							{'val': '['},
							{'val': ']'}
						]}
					]},
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
				]},
				{'val': ';', 'type': ParseTreeTokenType.SEMICOLON, 'children': []}
			]
		}
		},
	];
	processParseTestCases(cases, logger);
};