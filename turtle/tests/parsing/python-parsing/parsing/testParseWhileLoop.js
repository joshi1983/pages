import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseWhileLoop(logger) {
	const cases = [
	{
		'code': 'while condition:',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': 'while',
				'type': ParseTreeTokenType.WHILE_LOOP,
				'children': [
					{'val': 'condition', 'children': []},
					{'val': ':', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []}
				]
				}
			]
		}
	},
	{
		'code': 'while condition:\n\tcontinue',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': 'while',
				'type': ParseTreeTokenType.WHILE_LOOP,
				'children': [
					{'val': 'condition', 'children': []},
					{'val': ':', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'continue', 'type': ParseTreeTokenType.CONTINUE, 'children': []}
					]}
				]
				}
			]
		}
	},
	{
		'code': `while condition:\n\t\nelse:\n\tpass`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': 'while',
				'type': ParseTreeTokenType.WHILE_LOOP,
				'children': [
					{'val': 'condition', 'children': []},
					{'val': ':', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': 'else', 'type': ParseTreeTokenType.ELSE, 'children': [
						{'val': ':', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
							{'val': 'pass'}
						]},
					]}
				]
				}
			]
		}
	}
	];
	processParseTestCases(cases, logger);
};