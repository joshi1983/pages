import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseIfStatement(logger) {
	const cases = [
	{
		'code': 'if',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': 'if',
				'type': ParseTreeTokenType.IF_STATEMENT,
				'children': []
			}]
		}
	},
	{
		'code': 'if condition:',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': 'if',
				'type': ParseTreeTokenType.IF_STATEMENT,
				'children': [
					{'val': 'condition', 'children': []},
					{'val': ':', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []}
				]
				}
			]
		}
	},{
		'code': 'if condition:\n\tprint "hi"',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': 'if',
				'type': ParseTreeTokenType.IF_STATEMENT,
				'children': [
					{'val': 'condition', 'children': []},
					{'val': ':', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'print', 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
								{'val': '"hi"', 'type': ParseTreeTokenType.STRING_LITERAL, 'children': []}
							]}
						]}
					]}
				]
				}
			]
		}
	},{
		'code': 'if (condition):',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': 'if',
				'type': ParseTreeTokenType.IF_STATEMENT,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
						{'val': '(', 'children': []},
						{'val': 'condition', 'children': []},
						{'val': ')', 'children': []}
					]},
					{'val': ':', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []}
				]}
			]
		}
	},{
		'code': 'if condition:\n\tprint "hi"\nelif',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': 'if',
				'type': ParseTreeTokenType.IF_STATEMENT,
				'children': [
					{'val': 'condition', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ':', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'print', 'children': [
							{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
								{'val': '"hi"', 'children': []}
							]}
						]}
					]},
					{'val': 'elif', 'type': ParseTreeTokenType.ELIF, 'children': []},
				]
			}]
		}
	},{
		'code': 'if condition:\nelif condition2:\nelse:',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': 'if',
				'type': ParseTreeTokenType.IF_STATEMENT,
				'children': [
					{'val': 'condition', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ':', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': 'elif', 'type': ParseTreeTokenType.ELIF, 'children': [
						{'val': 'condition2', 'children': []},
						{'val': ':', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					]},
					{'val': 'else', 'type': ParseTreeTokenType.ELSE, 'children': [
						{'val': ':', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					]},
				]
			}]
		}
	},
	{
		'code': 'if condition:\n\treturn\nelse:',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': 'if',
				'type': ParseTreeTokenType.IF_STATEMENT,
				'children': [
					{
					'val': 'condition',
					'type': ParseTreeTokenType.IDENTIFIER,
					'children': []
					},
					{'val': ':', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'return', 'type': ParseTreeTokenType.RETURN, 'children': []}
					]},
					{'val': 'else', 'children': [
						{'val': ':', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []}
					]},
				]},
			]
		}
	},
	{
		'code': 'if n:\nif',
		'numTopChildren': 2
	},
	{
		'code': `if n:\n\tm=m-1\nif`,
		'numTopChildren': 2
	},
	{
		'code': `	if n:
		m=m-1
	else:
		m=m+1
	if`,
		'numTopChildren': 2
	}
	];
	processParseTestCases(cases, logger);
};