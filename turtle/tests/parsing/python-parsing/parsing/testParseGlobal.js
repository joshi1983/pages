import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseGlobal(logger) {
	const cases = [
	{
		'code': "def f():\n\tglobal x",
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.FUNCTION_DEFINITION,
				'children': [
					{'val': 'def', 'type': ParseTreeTokenType.DEF, 'children': []},
					{'val': 'f', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'children': [
						{'val': '('},
						{'val': ')'}
					]},
					{'val': ':', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'global', 'type': ParseTreeTokenType.GLOBAL, 'children': [
							{'val': 'x'}
						]}
					]}
				]
			}]
		}
	},{
		'code': "def f():\n\tglobal x\n\tx=4",
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.FUNCTION_DEFINITION,
				'children': [
					{'val': 'def', 'type': ParseTreeTokenType.DEF, 'children': []},
					{'val': 'f', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'children': [
						{'val': '('},
						{'val': ')'}
					]},
					{'val': ':', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'global', 'type': ParseTreeTokenType.GLOBAL, 'children': [
							{'val': 'x'}
						]},
						{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
							{'val': 'x', 'children': []},
							{'val': '4', 'children': []}
						]}
					]}
				]
			}]
		}
	},{
		'code': `def modify_globals():
	global x, y`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.FUNCTION_DEFINITION,
				'children': [
					{'val': 'def', 'type': ParseTreeTokenType.DEF, 'children': []},
					{'val': 'modify_globals', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'children': [
						{'val': '('},
						{'val': ')'}
					]},
					{'val': ':', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'global', 'type': ParseTreeTokenType.GLOBAL, 'children': [
							{'val': 'x', 'children': []},
							{'val': ',', 'children': []},
							{'val': 'y', 'children': []}
						]}
					]}
				]
			}]
		}		
	}];
	processParseTestCases(cases, logger);
};