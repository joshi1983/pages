import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseFuncCall(logger) {
	const cases = [
	{'code': 'f()', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.FUNC_CALL,
			'children': [
				{'val': 'f', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
				{'val': null, 'type': ParseTreeTokenType.ARC_LIST,
					'children': [
						{'val': '(', 'children': []},
						{'val': ')', 'children': []}
					]
				}
			]}
		]
	}},
	{'code': 'p.f()', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.FUNC_CALL,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
					{'val': 'p', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': []},
					{'val': 'f', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
				]},
				{'val': null, 'type': ParseTreeTokenType.ARC_LIST,
					'children': [
						{'val': '(', 'children': []},
						{'val': ')', 'children': []}
					]
				}
			]}
		]
	}},
	{'code': 'x.y.p.f()', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.FUNC_CALL,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
						{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
							{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': []},
							{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						]},
						{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': []},
						{'val': 'p', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					]},
					{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': []},
					{'val': 'f', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
				]},
				{'val': null, 'type': ParseTreeTokenType.ARC_LIST,
					'children': [
						{'val': '(', 'children': []},
						{'val': ')', 'children': []}
					]
				}
			]}
		]
	}},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};