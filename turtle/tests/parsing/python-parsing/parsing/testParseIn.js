import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseIn(logger) {
	const cases = [
	{
		'code': 'print(1 in [1, 2])',
		'numTopChildren': 1,
			'treeInfo': {
				'children': [{
					'val': 'print',
					'children': [
						{'val': null, 'children': [
							{'val': '('},
							{'val': 'in', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
								{'val': '1', 'children': []},
								{'val': null, 'type': ParseTreeTokenType.LIST_LITERAL, 'children': [
									{'val': '['},
									{'val': '1'},
									{'val': ','},
									{'val': '2'},
									{'val': ']'}
								]},
							]},
							{'val': ')'}
						]}
					]
				}
				]
			}
	}
	];
	processParseTestCases(cases, logger);
};