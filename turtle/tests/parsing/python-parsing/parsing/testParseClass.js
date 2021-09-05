import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseClass(logger) {
	const cases = [
	{
		'code': 'class A',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'class',
				'type': ParseTreeTokenType.CLASS,
				'children': [
					{'val': 'A', 'type': ParseTreeTokenType.IDENTIFIER}
				]
			}]
		}
	},
	{
		'code': 'class A:\n\tpass',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'class',
				'type': ParseTreeTokenType.CLASS,
				'children': [
					{'val': 'A', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CLASS_BODY, 'children': [
						{'val': 'pass', 'type': ParseTreeTokenType.PASS, 'children': []}
					]}
				]
			}]
		}
	},
	{
		'code': 'class B:\n\tdef __init__(self):\n\t\tpass',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'class',
				'type': ParseTreeTokenType.CLASS,
				'children': [
					{'val': 'B', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CLASS_BODY, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_DEFINITION, 'children': [
							{'val': 'def', 'type': ParseTreeTokenType.DEF, 'children': []},
							{'val': '__init__', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
								{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET, 'children': []},
								{'val': 'self', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
								{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET, 'children': []}
							]},
							{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
							{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
								{'val': 'pass', 'type': ParseTreeTokenType.PASS, 'children': []}
							]}
						]}
					]}
				]
			}]
		}
	},
	{
		'code': 'class C:\n\t@staticmethod\n\tdef method1(x):\n\t\treturn x',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'class',
				'type': ParseTreeTokenType.CLASS,
				'children': [
					{'val': 'C', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CLASS_BODY, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_DEFINITION, 'children': [
							{'val': '@staticmethod', 'children': []},
							{'val': 'def', 'type': ParseTreeTokenType.DEF, 'children': []},
							{'val': 'method1', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
								{'val': '(', 'children': []},
								{'val': 'x', 'children': []},
								{'val': ')', 'children': []}
							]},
							{'val': ':', 'children': []},
							{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
								{'val': 'return', 'type': ParseTreeTokenType.RETURN, 'children': [
									{'val': 'x', 'children': []}
								]}
							]}
						]},
					]}
				]},
			]}
	},{
		'code': 'class C:\n\t@classmethod\n\tdef method1(self):\n\t\treturn self.x',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'class',
				'type': ParseTreeTokenType.CLASS,
				'children': [
					{'val': 'C', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CLASS_BODY, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_DEFINITION, 'children': [
							{'val': '@classmethod', 'children': []},
							{'val': 'def', 'type': ParseTreeTokenType.DEF, 'children': []},
							{'val': 'method1', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST},
							{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
							{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
						]}
					]}
				]},
			]}
	}
	];
	processParseTestCases(cases, logger);
};