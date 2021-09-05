import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseFunctionCall(logger) {
	const cases = [
	{
		'code': 'f()',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'f',
				'type': ParseTreeTokenType.FUNCTION_CALL,
				'children': [{
						'val': null,
						'type': ParseTreeTokenType.ARGUMENT_LIST,
						'children': [
							{'val': '(', 'children': []},
							{'val': ')', 'children': []},
						]
					}
				]
			}]
		}
	},
	{
		'code': 'f(3)',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'f',
				'type': ParseTreeTokenType.FUNCTION_CALL,
				'children': [{
						'val': null,
						'type': ParseTreeTokenType.ARGUMENT_LIST,
						'children': [
							{'val': '(', 'children': []},
							{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
							{'val': ')', 'children': []},
						]
					}
				]
			}]
		}
	},
	{
		'code': 'f(1,3)',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'f',
				'type': ParseTreeTokenType.FUNCTION_CALL,
				'children': [{
						'val': null,
						'type': ParseTreeTokenType.ARGUMENT_LIST,
						'children': [
							{'val': '(', 'children': []},
							{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
							{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
							{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
							{'val': ')', 'children': []},
						]
					}
				]
			}]
		}
	},
	{
		'code': 'f(x=3)',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'f',
				'type': ParseTreeTokenType.FUNCTION_CALL,
				'children': [{
						'val': null,
						'type': ParseTreeTokenType.ARGUMENT_LIST,
						'children': [
							{'val': '(', 'children': []},
							{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
								{'val': 'x', 'children': []},
								{'val': '3', 'children': []}
							]},
							{'val': ')', 'children': []},
						]
					}
				]
			}]
		}
	}
	];
	processParseTestCases(cases, logger);
};