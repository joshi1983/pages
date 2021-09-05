import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseLongStringLiteral(logger) {
	const cases = [
	{
		'code': 'print """some long string"""',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': 'print',
				'type': ParseTreeTokenType.FUNCTION_CALL,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
						{'val': '"""some long string"""', 'type': ParseTreeTokenType.LONG_STRING_LITERAL, 'children': []}
					]}
				]
			}
			]
		}
	},
	{
		'code': 'print("""some long string""")',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': 'print',
				'type': ParseTreeTokenType.FUNCTION_CALL,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
						{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET, 'children': []},
						{'val': '"""some long string"""', 'type': ParseTreeTokenType.LONG_STRING_LITERAL, 'children': []},
						{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET, 'children': []}
					]}
				]
			}
			]
		}
	}
	];
	processParseTestCases(cases, logger);
};