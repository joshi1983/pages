import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseUnaryOperators(logger) {
	const cases = [{
		'code': `-x`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '-', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		}
	},{
		'code': `line-`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'line', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '-', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': []}
					]}
				]}
			]
		}
	},{
		'code': `(-x`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
					{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET, 'children': []},
					{'val': '-', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]}
				]}
			]
		}
	},{
		'code': `(2,-x`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.TUPLE_LITERAL, 'children': [
					{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET, 'children': []},
					{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
					{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
					{'val': '-', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]}
				]}
			]
		}
	},{
		'code': '(2)-x', // the - should not be a unary operator here.
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '-', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
						{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET, 'children': []},
						{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
						{'val': ')', 'children': []},
					]},
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		}
	},{
		'code': 'x = -y',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '=', 'children': [
					{'val': 'x', 'children': []},
					{'val': '-', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
						{'val': 'y', 'children': []}
					]}
				]
			}
		]}
	},{
		'code': '; -y',
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': ';', 'children': []},
				{'val': '-', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
					{'val': 'y', 'children': []}
				]}
		]}
	},{
		'code': 'not x',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'not', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
		]}
	},{
		'code': 'print (- 3)',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'print', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': '-', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
							{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
						]},
						{'val': ')', 'children': []}
					]}
				]}
		]}
	}];
	processParseTestCases(cases, logger);
};