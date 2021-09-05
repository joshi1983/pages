import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseCurvedBracketExpression(logger) {
	const cases = [
		{'code': '((2)*f)',
			'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
				'children': [
					{'val': '(', 'children': []},
					{
						'val': '*', 'children': [
							{'val': null, 'children': [
								{'val': '(', 'children': []},
								{'val': '2', 'children': []},
								{'val': ')', 'children': []}
							]},
							{'val': 'f', 'children': []}
						]
					},
					{'val': ')', 'children': []}
				]
				}
			]
		}
	},
	{'code': '1 - (2)*f',
		'treeInfo': {
			'children': [
				{'val': '-',
				'children': [
					{'val': '1', 'children': []},
					{'val': '*', 'children': [
						{'val': null, 'children': [
							{'val': '(', 'children': []},
							{'val': '2', 'children': []},
							{'val': ')', 'children': []}
						]},
						{
							'val': 'f', 'children': []
						}
					]}
				]}
			]
		}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};