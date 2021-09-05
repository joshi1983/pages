import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParsePrint(logger) {
	const cases = [
	{
		'code': 'print 3',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': 'print',
				'type': ParseTreeTokenType.FUNCTION_CALL,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
						{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL}
					]}
				]
			}]
		}
	},
	{
		'code': 'print None',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'print',
				'type': ParseTreeTokenType.FUNCTION_CALL,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
						{'val': 'None', 'type': ParseTreeTokenType.NONE}
					]}
				]
			}]
		}
	},
	{
		'code': 'print True',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'print',
				'type': ParseTreeTokenType.FUNCTION_CALL,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
						{'val': 'True', 'type': ParseTreeTokenType.BOOLEAN}
					]}
				]
			}]
		}
	},
	{
		'code': 'print x',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'print',
				'type': ParseTreeTokenType.FUNCTION_CALL,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER}
					]}
				]
			}]
		}
	},
	{
		'code': 'print(3)',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': 'print',
				'type': ParseTreeTokenType.FUNCTION_CALL,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
						{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
						{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL},
						{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
					]}
				]
			}]
		}
	},
	{
		'code': 'print(3)\nprint(4)',
		'numTopChildren': 2
	},
	{
		'code': 'print(3)\nprint(4)\nprint "hi"',
		'numTopChildren': 3
	}
	];
	processParseTestCases(cases, logger);
};