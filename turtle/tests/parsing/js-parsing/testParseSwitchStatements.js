import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseSwitchStatements(logger) {
	const cases = [
		{'code': 'switch (x) {case 1: console.log("hi");}', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'val': null,
			'children': [
				{'val': 'switch', 'type': ParseTreeTokenType.SWITCH, 'children': [
					{'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'val': null, 'children': [
						{'val': '('},
						{'val': 'x'},
						{'val': ')'}
					]},
					{'type': ParseTreeTokenType.CODE_BLOCK, 'val': null, 'children': [
						{'val': '{'},
						{'val': 'case', 'children': [
							{'val': '1'},
							{'val': ':'},
							{'type': ParseTreeTokenType.CODE_BLOCK, 'val': null, 'children': [
								{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
									{'val': 'console', 'children': [
										{'val': '.', 'children': [
											{'val': 'log', 'children': [
											]}
										]}
									]},
									{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
										{'val': '('},
										{'val': '"hi"'},
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
		{'code': 'switch (x) {case 1: console.log("hi");break; case 2: break;}', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'val': null,
			'children': [
				{'val': 'switch', 'type': ParseTreeTokenType.SWITCH, 'children': [
					{'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'val': null, 'children': [
						{'val': '('},
						{'val': 'x'},
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
		{'code': 'switch (x) {case 1: console.log("hi");break; default: break;}', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'val': null,
			'children': [
				{'val': 'switch', 'type': ParseTreeTokenType.SWITCH, 'children': [
					{'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'val': null, 'children': [
						{'val': '('},
						{'val': 'x'},
						{'val': ')'}
					]},
					{'type': ParseTreeTokenType.CODE_BLOCK, 'val': null, 'children': [
						{'val': '{'},
						{'val': 'case'},
						{'val': 'default', 'children': [
							{'val': ':'},
							{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
								{'val': 'break'},
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
		{'code': 'switch (foo) {case console.log("hi"):}', 'numTopChildren': 1, 'treeInfo': {
			'children': [
				{'val': 'switch', 'children': [
					{'val': null},
					{'val': null, 'children': [
						{'val': '{'},
						{'val': 'case', 'type': ParseTreeTokenType.CASE, 'children': [
							{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
								{'val': 'console', 'children': [
									{'val': '.', 'children': [
										{'val': 'log'}
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