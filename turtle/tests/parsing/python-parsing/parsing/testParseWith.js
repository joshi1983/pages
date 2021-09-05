import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseWith(logger) {
	const cases = [
	{
		'code': "with open('example.txt') as file:",
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'with',
				'type': ParseTreeTokenType.WITH,
				'children': [
					{'val': 'as', 'type': ParseTreeTokenType.AS, 'children': [
						{'val': 'open', 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST}
						]},
						{'val': 'file'}
					]},
					{'val': ':', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []}
				]
			}]
		}
	}];
	processParseTestCases(cases, logger);
};