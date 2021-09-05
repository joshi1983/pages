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
	}];
	processParseTestCases(cases, logger);
};