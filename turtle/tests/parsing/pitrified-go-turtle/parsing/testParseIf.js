import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseIf(logger) {
	const cases = [
	{'code': 'if true {}', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': 'if', 'type': ParseTreeTokenType.IF,
			'children': [
				{
					'val': 'true',
					'type': ParseTreeTokenType.BOOLEAN_LITERAL,
					'children': []
				},
				{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK,
				'children': [
					{'val': '{', 'children': []},
					{'val': '}', 'children': []}
				]},
			]
			}
		]
	}},
	{'code': 'if true {} else {}', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': 'if', 'type': ParseTreeTokenType.IF,
			'children': [
				{
					'val': 'true',
					'type': ParseTreeTokenType.BOOLEAN_LITERAL,
					'children': []
				},
				{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []},
						{'val': '}', 'children': []}
				]},
				{'val': 'else', 'type': ParseTreeTokenType.ELSE, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []},
						{'val': '}', 'children': []}
					]},
				]}
			]
			}
		]}
	},
	{'code': 'if true {} else if x {}', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': 'if', 'type': ParseTreeTokenType.IF,
			'children': [
				{
					'val': 'true',
					'type': ParseTreeTokenType.BOOLEAN_LITERAL,
					'children': []
				},
				{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []},
						{'val': '}', 'children': []}
				]},
				{'val': null, 'type': ParseTreeTokenType.ELSE_IF, 'children': [
					{'val': 'else', 'type': ParseTreeTokenType.ELSE, 'children': []},
					{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': []},
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []},
						{'val': '}', 'children': []}
					]}
				]}
			]
			}
		]}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};