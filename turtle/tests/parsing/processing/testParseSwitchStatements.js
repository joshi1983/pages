import { ParseTreeTokenType } from '../../../modules/parsing/processing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseSwitchStatements(logger) {
	const cases = [
		{'code': 'switch (x) {case 1: o.y("hi");}', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'val': null,
			'children': [
				{'val': 'switch', 'type': ParseTreeTokenType.SWITCH, 'children': [
					{'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'val': null, 'children': [
						{'val': '('},
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': ')'}
					]},
					{'type': ParseTreeTokenType.CODE_BLOCK, 'val': null, 'children': [
						{'val': '{'},
						{'val': 'case', 'children': [
							{'val': '1'},
							{'val': ':'},
							{'type': ParseTreeTokenType.CODE_BLOCK, 'val': null, 'children': [
								{'val': null, 'type': ParseTreeTokenType.METHOD_CALL, 'children': [
									{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT, 'children': [
										{'val': 'o', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
										{'val': '.', 'children': [
											{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER, 'children': [
											]}
										]}
									]},
									{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
										{'val': '('},
										{'val': '"hi"', 'type': ParseTreeTokenType.STRING_LITERAL},
										{'val': ')'}
									]}
								]},
								{'val': ';'}
							]}
						]},
						{'val': '}'}
					]}
				]
				}
			]
		}},
		{'code': 'switch (x) {case 1: o.y("hi");break; case 2: break;}', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'val': null,
			'children': [
				{'val': 'switch', 'type': ParseTreeTokenType.SWITCH, 'children': [
					{'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'val': null, 'children': [
						{'val': '('},
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': ')'}
					]},
					{'type': ParseTreeTokenType.CODE_BLOCK, 'val': null, 'children': [
						{'val': '{'},
						{'val': 'case'},
						{'val': 'case'},
						{'val': '}'}
					]}
				]}
			]
		}
		},
		{'code': 'switch (x) {case 1: o.y("hi");break; default: break;}', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'val': null,
			'children': [
				{'val': 'switch', 'type': ParseTreeTokenType.SWITCH, 'children': [
					{'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'val': null, 'children': [
						{'val': '('},
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': ')'}
					]},
					{'type': ParseTreeTokenType.CODE_BLOCK, 'val': null, 'children': [
						{'val': '{'},
						{'val': 'case'},
						{'val': 'default', 'children': [
							{'val': ':'},
							{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
								{'val': 'break', 'type': ParseTreeTokenType.BREAK},
								{'val': ';'}
							]},
						]},
						{'val': '}'}
					]}
				]}
				]
			}
		},
		{'code': 'switch (foo) {case 2:case 3:}', 'numTopChildren': 1},
		{'code': 'switch (foo) {case o.y("hi"):}', 'numTopChildren': 1, 'treeInfo': {
			'children': [
				{'val': 'switch', 'children': [
					{'val': null},
					{'val': null, 'children': [
						{'val': '{'},
						{'val': 'case', 'type': ParseTreeTokenType.CASE, 'children': [
							{'val': null, 'type': ParseTreeTokenType.METHOD_CALL, 'children': [
								{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT, 'children': [
									{'val': 'o', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
									{'val': '.', 'children': [
										{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER}
									]}
								]},
								{'val': null, 'children': [
									{'val': '('},
									{'val': '"hi"'},
									{'val': ')'}
								]}
							]},
							{'val': ':'}
						]},
						{'val': '}'}
					]}
				]}
		]}
		}
	];
	processParseTestCases(cases, logger);
};