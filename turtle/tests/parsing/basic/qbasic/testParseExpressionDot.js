import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseExpressionDot(logger) {
	const cases = [{
		'code': `j.x`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT, 'children': [
					{'val': 'j', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': []},
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]},
			]
		}
	},{
		'code': '(j.',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
					{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT, 'children': [
						{'val': 'j', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': []},
					]},
				]}
			]}
	},{
		'code': `(j.x)`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
					{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT, 'children': [
						{'val': 'j', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': []},
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]},
					{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET, 'children': []},
				]}
			]}
	},{
		'code': `j.x=3`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT, 'children': [
						{'val': 'j', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': []},
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]},
					{'val': '3'}
				]}
			]
		}
	},{
		'code': `j().x=3`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': 'j', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
								{'val': '('},
								{'val': ')'},
							]}
						]},
						{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': []},
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]},
					{'val': '3'}
				]}
			]
		}
	},{
		'code': 'x.dir = f.dir',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': []},
						{'val': 'dir', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT, 'children': [
						{'val': 'f', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': []},
						{'val': 'dir', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]},
				]}
			]
		}
	},{
		'code': 'm1 = (line1.y2)',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
					{'val': 'm1', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
						{'val': '('},
						{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT, 'children': [
							{'val': 'line1', 'children': []},
							{'val': '.', 'children': []},
							{'val': 'y2', 'children': []}
						]},
						{'val': ')'},
					]},
				]},
			]},
	},{
		'code': 'm1 = (line1.y2 - e) / 5',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
					{'val': 'm1', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': '/', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
							{'val': '('},
							{'val': '-', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
								{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT, 'children': [
									{'val': 'line1', 'children': []},
									{'val': '.', 'children': []},
									{'val': 'y2', 'children': []}
								]},
								{'val': 'e', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
							]},
							{'val': ')'},
						]},
						{'val': '5', 'children': []}
					]}
				]}
			]}
	},{
		'code': 'CIRCLE (x.',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'CIRCLE', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT, 'children': [
							{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': []}
						]}
					]}
				]}
			]}
	},{
		'code': `dim a
a(1).x = 5`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'dim', 'type': ParseTreeTokenType.DIM, 'children': [
					{'val': 'a', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
				]},
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT, 'children': [
						{'val': null, 'children': [
							{'val': 'a', 'children': []},
							{'val': null, 'children': [
								{'val': '(', 'children': []},
								{'val': '1', 'children': []},
								{'val': ')', 'children': []},
							]}
						]},
						{'val': '.', 'children': []},
						{'val': 'x', 'children': []}
					]},
					{'val': '5', 'children': []}
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};