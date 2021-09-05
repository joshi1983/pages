import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseFor(logger) {
	const cases = [
	{'code': 'for {}', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'for', 'type': ParseTreeTokenType.FOR,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK,
					'children': [
						{'val': '{', 'children': []},
						{'val': '}', 'children': []}
					]},
				]
				}
			]
	}},
	{'code': 'for i',
	'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'for', 'type': ParseTreeTokenType.FOR,
				'children': [
					{'val': 'i', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
				]
				}
			]
	}
	},
	{'code': 'for i:=',
	'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'for', 'type': ParseTreeTokenType.FOR,
				'children': [
					{'val': ':=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
						{'val': 'i', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					]},
				]
				}
			]
	}},
	{'code': 'for i:= range',
	'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'for', 'type': ParseTreeTokenType.FOR,
				'children': [
					{'val': ':=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
						{'val': 'i', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': 'range', 'type': ParseTreeTokenType.RANGE, 'children': []},
					]},
				]
				}
			]
	}},
	{'code': 'for i:= range someList',
	'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'for', 'type': ParseTreeTokenType.FOR,
				'children': [
					{'val': ':=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
						{'val': 'i', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': 'range', 'type': ParseTreeTokenType.RANGE, 'children': [
							{'val': 'someList', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						]}
					]},
				]
				}
			]
	}},
	{'code': 'for i:= range someList {',
	'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'for', 'type': ParseTreeTokenType.FOR,
				'children': [
					{'val': ':=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
						{'val': 'i', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': 'range', 'type': ParseTreeTokenType.RANGE, 'children': [
							{'val': 'someList', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						]}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'type': ParseTreeTokenType.CURLY_LEFT_BRACKET, 'children': []},
					]}
				]
				}
			]
	}},
	{'code': 'for i:= range someList {}',
	'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'for', 'type': ParseTreeTokenType.FOR,
				'children': [
					{'val': ':=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'type': ParseTreeTokenType.CURLY_LEFT_BRACKET, 'children': []},
						{'val': '}', 'type': ParseTreeTokenType.CURLY_RIGHT_BRACKET, 'children': []},
					]}
				]
				}
			]
	}},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};