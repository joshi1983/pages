import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseWhile(logger) {
	const cases = [{
		'code': `WHILE n < 25
WEND`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'WHILE', 'type': ParseTreeTokenType.WHILE, 'children': [
					{'val': '<', 'children': [
						{'val': 'n', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': '25', 'type': ParseTreeTokenType.NUMBER_LITERAL}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': 'WEND', 'type': ParseTreeTokenType.WEND}
				]}
			]
		}
	},{
		'code': `WHILE n < 25
PRINT n
n = n+1
WEND`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'WHILE', 'type': ParseTreeTokenType.WHILE, 'children': [
					{'val': '<', 'children': [
						{'val': 'n', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': '25', 'type': ParseTreeTokenType.NUMBER_LITERAL}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': 'PRINT', 'type': ParseTreeTokenType.IDENTIFIER},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
								{'val': 'n', 'type': ParseTreeTokenType.IDENTIFIER}
							]}
						]},
						{'val': '=', 'children': [
							{'val': 'n'},
							{'val': '+', 'children': [
								{'val': 'n'},
								{'val': '1'},
							]},
						]}
					]},
					{'val': 'WEND', 'type': ParseTreeTokenType.WEND}
				]}
			]
		}
	},{
		'code': `WHILE 1
Print (c) *`,
		'parseSettings': {
			'skipScanTokenSanitization': true
		},
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'WHILE', 'type': ParseTreeTokenType.WHILE, 'children': [
					{'val': '1'},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL,
						'children': [
							{'val': 'Print'},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST,
							'children': [
								{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR,
								'children': [
									{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
									'children': [
										{'val': '('},
										{'val': 'c'},
										{'val': ')'},
									]},
								]}
							]},
						]},
					]},
				]}
			]}
	},{
		'code': `WHILE 1
IF 1 THEN
PSET x, (x) *`,
		'parseSettings': {
			'skipScanTokenSanitization': true
		},
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'WHILE', 'type': ParseTreeTokenType.WHILE, 'children': [
					{'val': '1'},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'IF', 'type': ParseTreeTokenType.IF,
						'children': [
							{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
							{'val': 'THEN', 'type': ParseTreeTokenType.THEN, 'children': []},
							{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK,
							'children': [
								{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL,
								'children': [
									{'val': 'PSET'},
									{'val': null, 'type': ParseTreeTokenType.ARG_LIST,
									'children': [
										{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
										{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
										{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
											{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
												{'val': '(', 'children': []},
												{'val': 'x', 'children': []},
												{'val': ')', 'children': []},
											]}
										]},
									]},
								]},
							]},
						]},
					]},
				]},
			]},
	}];
	processParseTestCases(cases, logger);
};