import { ParseTreeTokenType } from '../../../modules/parsing/processing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseDeclarations(logger) {
	const cases = [
		{'code': 'String x = "hi";', 'numTopChildren': 2, 'maxDepth': 4, 
		'treeInfo': {
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
		{'code': 'int x=4', 'numTopChildren': 1, 'maxDepth': 4,
		'treeInfo': wrapSingleTreeInfoObject({
			'val': null, 'type': ParseTreeTokenType.DECLARATION, 'children': [
				{'type': ParseTreeTokenType.DATA_TYPE, 'val': 'int', 'children': []},
				{'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'val': '=', 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL}
				]}
			]}
		)},
		{'code': 'int x=-4', 'numTopChildren': 1, 'maxDepth': 4,
		'treeInfo': wrapSingleTreeInfoObject({
			'val': null, 'type': ParseTreeTokenType.DECLARATION, 'children': [
					{'type': ParseTreeTokenType.DATA_TYPE, 'val': 'int', 'children': []},
					{'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'val': '=', 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': '-4', 'type': ParseTreeTokenType.NUMBER_LITERAL}
					]}
				]})
		},
		{'code': 'int red = 0, green = 1', 'numTopChildren': 1,
		'treeInfo': wrapSingleTreeInfoObject(
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
			]})
		},
		{'code': 'int[] x;', 'numTopChildren': 2, 'maxDepth': 5,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DECLARATION, 'children': [
					{'val': null, 'type': ParseTreeTokenType.ARRAY_DATATYPE_EXPRESSION, 'children': [
						{'type': ParseTreeTokenType.DATA_TYPE, 'val': 'int', 'children': [
						]},
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
		{'code': 'A[] m', 'numTopChildren': 1,
		'treeInfo': wrapSingleTreeInfoObject({
			'type': ParseTreeTokenType.DECLARATION, 'val': null, 'children': [
				{'val': null, 'type': ParseTreeTokenType.ARRAY_DATATYPE_EXPRESSION, 'children': [
					{'val': 'A', 'type': ParseTreeTokenType.DATA_TYPE, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.DIMENSION_INDICATOR, 'children': [
						{'val': '['},
						{'val': ']'},
					]}
				]},
				{'val': 'm'}
			]
		})},
		{'code': 'int[] data = {0, 1, 3, 4};', 'numTopChildren': 2,
		'treeInfo': {
			'val': null,
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DECLARATION,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.ARRAY_DATATYPE_EXPRESSION, 'children': [
						{'val': 'int', 'type': ParseTreeTokenType.DATA_TYPE, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.ARRAY_DIMENSION_INDICATOR, 'children': [
							{'val': '['},
							{'val': ']'}
						]}
					]},
					{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
						{'val': 'data', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.CURLY_BRACKET_EXPRESSION, 'children': [
							{'val': '{'},
							{'val': '0', 'type': ParseTreeTokenType.NUMBER_LITERAL},
							{'val': ','},
							{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL},
							{'val': ','},
							{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL},
							{'val': ','},
							{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL},
							{'val': '}'},
						]}
					]}
				]},
				{'val': ';', 'type': ParseTreeTokenType.SEMICOLON},
			]
		}},
		{'code': 'processing.A x', 'numTopChildren': 1,
		'treeInfo': wrapSingleTreeInfoObject({
			'type': ParseTreeTokenType.DECLARATION,
			'val': null,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT, 'children': [
					{'val': 'processing', 'children': []},
					{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
						{'val': 'A', 'children': []}
					]}
				]},
				{
					'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER,
					'children': []
				}
			]
		})
		},
		{'code': 'processing.A[] x', 'numTopChildren': 1,
		'treeInfo': wrapSingleTreeInfoObject({
			'type': ParseTreeTokenType.DECLARATION,
			'val': null,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.ARRAY_DATATYPE_EXPRESSION,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT, 'children': [
						{'val': 'processing', 'children': []},
						{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
							{'val': 'A', 'children': []}
						]},
					]},
					{'val': null, 'type': ParseTreeTokenType.ARRAY_DIMENSION_INDICATOR, 'children': [
						{'val': '[', 'children': []},
						{'val': ']', 'children': []}
					]}
				]},
				{
					'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER,
					'children': []
				}
			]
		})
		},
		{'code': 'final int x = 3;', 'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'val': null,
			'children': [
				{'val': 'final', 'type': ParseTreeTokenType.FINAL,
				'children': [
					{'val': null,
					'type': ParseTreeTokenType.DECLARATION,
					'children': [
						{'val': 'int', 'type': ParseTreeTokenType.DATA_TYPE, 'children': []},
						{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
							{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
						]}
					]}
				]},
				{'val': ';', 'type': ParseTreeTokenType.SEMICOLON}
			]
		}}
	];
	processParseTestCases(cases, logger);
};