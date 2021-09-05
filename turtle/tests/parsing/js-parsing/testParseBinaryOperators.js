import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseBinaryOperators(logger) {
	const onePlusFourInfo = {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': '+', 'children': [
				{'val': '1'},
				{'val': '4'}
			]}
		]
	};
	const cases = [
		{'code': '1+4', 'numTopChildren': 1, 'maxDepth': 3, 'treeInfo': onePlusFourInfo},
		{'code': '1 + 4', 'numTopChildren': 1, 'maxDepth': 3, 'treeInfo': onePlusFourInfo},
		{'code': '1 - 4', 'numTopChildren': 1, 'maxDepth': 3},
		{'code': '1-4', 'numTopChildren': 1, 'maxDepth': 3},
		{'code': '1-4*2', 'numTopChildren': 1, 'maxDepth': 4, 'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '-', 'children': [
					{'val': '1'},
					{'val': '*', 'children': [
						{'val': '4'},
						{'val': '2'}
					]}
				]}
			]
		}},
		{'code': '3*4-2', 'numTopChildren': 1, 'maxDepth': 4, 'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '-', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
					{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': '3'},
						{'val': '4'}
					]},
					{'val': '2'}
				]}
			]
		}},
		{'code': '2*3**4', 'numTopChildren': 1, 'maxDepth': 4, 'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
					{'val': '2'},
					{'val': '**', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': '3'},
						{'val': '4'}
					]}
				]}
			]
		}},
		{'code': '1+2-3', 'numTopChildren': 1, 'maxDepth': 4},
		{'code': '1*4', 'numTopChildren': 1, 'maxDepth': 3},
		{'code': '1/4', 'numTopChildren': 1, 'maxDepth': 3, 'treeInfo': {
			'val': null,
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.BINARY_OPERATOR, 'val': '/', 'children': [
					{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL}
				]}
			]
		}},
		{'code': '1%4', 'numTopChildren': 1, 'maxDepth': 3},
		{'code': '1<4', 'numTopChildren': 1, 'maxDepth': 3},
		{'code': '1<<4', 'numTopChildren': 1, 'maxDepth': 3},
		{'code': '1>>4', 'numTopChildren': 1, 'maxDepth': 3},
		{'code': 'x => 4', 'numTopChildren': 1, 'maxDepth': 3},
		{'code': 'x=>4', 'numTopChildren': 1, 'maxDepth': 3},
		{'code': '(4+1)', 'numTopChildren': 1, 'maxDepth': 4, 'treeInfo': {
			'val': null,
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'val': null, 'children': [
					{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
					{'type': ParseTreeTokenType.BINARY_OPERATOR, 'val': '+', 'children': [
						{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL},
						{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL}
					]},
					{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
				]}
			]
		}},
		{'code': '(4+1);', 'numTopChildren': 2, 'maxDepth': 4, 'treeInfo': {
			'val': null,
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'val': null, 'children': [
					{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
					{'type': ParseTreeTokenType.BINARY_OPERATOR, 'val': '+', 'children': [
						{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL},
						{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL}
					]},
					{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
				]},
				{'val': ';', 'type': ParseTreeTokenType.SEMICOLON}
			]
		}},
		{'code': '(xyz+1);', 'numTopChildren': 2, 'maxDepth': 4, 'treeInfo': {
			'val': null,
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'val': null, 'children': [
					{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
					{'type': ParseTreeTokenType.BINARY_OPERATOR, 'val': '+', 'children': [
						{'val': 'xyz', 'type': ParseTreeTokenType.IDENTICAL},
						{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL}
					]},
					{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
				]},
				{'val': ';', 'type': ParseTreeTokenType.SEMICOLON}
			]
		}},
		{'code': `d /= a
q = 3/9`, 'numTopChildren': 2}
	];
	processParseTestCases(cases, logger);
};