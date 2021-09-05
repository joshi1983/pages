import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseExpressionDot(logger) {
	const cases = [
		{
			'code': "turtle.Screen().bgcolor('navy')",
			'numTopChildren': 1,
			'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.EXPRESSION_DOT,
				'children': [
					{'val': 'turtle', 'type': ParseTreeTokenType.IDENTIFIER, 'children': [
						{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
							{'val': 'Screen', 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
								{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
									{'val': '(', 'children': []},
									{'val': ')', 'children': []}
								]}
							]}
						]}
					]},
					{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
						{'val': 'bgcolor', 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
								{'val': '(', 'children': []},
								{'val': "'navy'", 'type': ParseTreeTokenType.STRING_LITERAL, 'children': []},
								{'val': ')', 'children': []}
							]}
						]}
					]}
				]
			}]
		}
	},
	{
		'code': "if True:\n\tturtle.Screen().bgcolor('navy')",
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'if',
				'type': ParseTreeTokenType.IF_STATEMENT,
				'children': [{
						'val': 'True',
						'type': ParseTreeTokenType.BOOLEAN_LITERAL,
						'children': []
					},{
						'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []
					},{
						'val': null,
						'type': ParseTreeTokenType.CODE_BLOCK,
						'children': [{
							'val': null,
							'type': ParseTreeTokenType.EXPRESSION_DOT,
							'children': [
								{'val': 'turtle', 'type': ParseTreeTokenType.IDENTIFIER, 'children': [
									{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
										{'val': 'Screen', 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
											{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
												{'val': '(', 'children': []},
												{'val': ')', 'children': []}
											]}
										]}
									]}
								]},
								{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
									{'val': 'bgcolor', 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
										{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
											{'val': '(', 'children': []},
											{'val': "'navy'", 'type': ParseTreeTokenType.STRING_LITERAL, 'children': []},
											{'val': ')', 'children': []}
										]}
									]}
								]}
							]
						}
						]
					}
				]
			}]
		}
	}
	];
	processParseTestCases(cases, logger);
};
