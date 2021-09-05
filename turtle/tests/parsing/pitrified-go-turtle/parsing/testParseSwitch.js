import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseSwitch(logger) {
	const cases = [
	{
		'code': 'switch which {',
		'treeInfo': {
			'children': [
				{'val': 'switch', 'type': ParseTreeTokenType.SWITCH, 'children': [
					{'val': 'which', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.SWITCH_BLOCK, 'children': [
						{'val': '{', 'children': []}
					]}
				]}
			]
		}
	},
	{
		'code': 'switch time.Now().',
		'treeInfo': {
			'children': [
				{'val': 'switch', 'type': ParseTreeTokenType.SWITCH, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
							{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
								{'val': 'time', 'children': []},
								{'val': '.', 'children': []},
								{'val': 'Now', 'children': []}
							]},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
								{'val': '(', 'children': []},
								{'val': ')', 'children': []}
							]}
						]},
						{'val': '.', 'children': []}
					]}
				]}
			]
		}
	},
	{
		'code': 'switch time.Now().Weekday()',
		'treeInfo': {
			'children': [
				{'val': 'switch', 'type': ParseTreeTokenType.SWITCH, 'children': [
					{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
						{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
							{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
								{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
									{'val': 'time', 'children': []},
									{'val': '.', 'children': []},
									{'val': 'Now', 'children': []}
								]},
								{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
									{'val': '(', 'children': []},
									{'val': ')', 'children': []}
								]}
							]},
							{'val': '.', 'children': []},
							{'val': 'Weekday', 'children': []}
						]},
						{
							'val': null, 'type': ParseTreeTokenType.ARG_LIST,
							'children': [
								{'val': '(', 'children': []},
								{'val': ')', 'children': []}
							]
						}
					]}
				]}
			]
		}
	},
	{
		'code': `func d() {
   switch t := i.(type) {`,
		'treeInfo': {
			'children': [
				{'val': 'func', 'type': ParseTreeTokenType.FUNC, 'children': [
					{'val': 'd', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []},
						{'val': 'switch', 'type': ParseTreeTokenType.SWITCH, 'children': [
							{'val': ':=', 'children': [
								{'val': 't', 'children': []},
								{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
									{'val': 'i', 'children': []},
									{'val': '.', 'children': []},
									{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
										{'val': '(', 'children': []},
										{'val': 'type', 'children': []},
										{'val': ')', 'children': []}
									]}
								]}
							]},
							{'val': null, 'type': ParseTreeTokenType.SWITCH_BODY, 'children': [
								{'val': '{', 'children': []}
							]}
						]}
					]}
				]}
			]
		}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);	
}