import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseExpressionDotProperty(logger) {
	const cases = [
		{'code': 'math.Pi/3',
			'treeInfo': {
				'children': [
					{
						'val': '/',
						'children': [
							{
								'val': null,
								'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY,
								'children': [
									{'val': 'math', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
									{'val': '.', 'children': []},
									{'val': 'Pi', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
								]
							},
							{
								'val': '3',
								'children': []
							}
						]
					}
				]
			}
		},
		{'code': 'i.(type)',
			'treeInfo': {
				'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY,
						'children': [
							{'val': 'i', 'children': []},
							{'val': '.', 'children': []},
							{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
								{'val': '(', 'children': []},
								{'val': 'type', 'children': []},
								{'val': ')', 'children': []}
							]}
						]
					}
				]
			}
		}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};