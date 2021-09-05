import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseDot(logger) {
	const cases = [
	{
		'code': 'x.y',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'x',
				'type': ParseTreeTokenType.IDENTIFIER,
				'children': [
					{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
						{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER}
					]}
				]
			}]
		}
	},
	{
		'code': 'turtle.forward(5)',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'turtle',
				'type': ParseTreeTokenType.IDENTIFIER,
				'children': [
					{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
						{'val': 'forward', 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
								{'val': '('},
								{'val': '5'},
								{'val': ')'}
							]}
						]}
					]}
				]
			}]
		}
	}
	];
	processParseTestCases(cases, logger);
};