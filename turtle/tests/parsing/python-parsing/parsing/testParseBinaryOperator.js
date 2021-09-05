import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseBinaryOperator(logger) {
	const cases = [
	{
		'code': 'x+y',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': '+',
				'type': ParseTreeTokenType.BINARY_OPERATOR,
				'children': [{
						'val': 'x',
						'type': ParseTreeTokenType.IDENTIFIER
					},{
						'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER
					}
				]
			}]
		}
	},
	{
		'code': 'x-y',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': '-',
				'type': ParseTreeTokenType.BINARY_OPERATOR,
				'children': [{
						'val': 'x',
						'type': ParseTreeTokenType.IDENTIFIER
					},{
						'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER
					}
				]
			}]
		}
	},
	{
		'code': 'x*y',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': '*',
				'type': ParseTreeTokenType.BINARY_OPERATOR,
				'children': [{
						'val': 'x',
						'type': ParseTreeTokenType.IDENTIFIER
					},{
						'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER
					}
				]
			}]
		}
	},
	{
		'code': 'x**y',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': '**',
				'type': ParseTreeTokenType.BINARY_OPERATOR,
				'children': [{
						'val': 'x',
						'type': ParseTreeTokenType.IDENTIFIER
					},{
						'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER
					}
				]
			}]
		}
	},
	{
		'code': 'x+y*z',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': '+',
				'type': ParseTreeTokenType.BINARY_OPERATOR,
				'children': [{
						'val': 'x',
						'type': ParseTreeTokenType.IDENTIFIER
					},{
						'val': '*',
						'type': ParseTreeTokenType.BINARY_OPERATOR,
						'children': [{
								'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER
							},{
								'val': 'z', 'type': ParseTreeTokenType.IDENTIFIER
							}
						]
					}
				]
			}]
		}
	},
	{
		'code': 'x*y+z',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': '+',
				'type': ParseTreeTokenType.BINARY_OPERATOR
			}]
		}
	},
	];
	processParseTestCases(cases, logger);
};