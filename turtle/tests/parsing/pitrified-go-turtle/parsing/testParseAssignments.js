import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseAssignments(logger) {
	const cases = [
	{
		'code': 'x=3',
		'numTopChildren': 1, 'numComments': 0,
		'treeInfo': {
			'children': [
				{'val': '=',
				'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR,
				'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
				]
				}
			]
		}
	},
	{
		'code': 'x:=3',
		'numTopChildren': 1, 'numComments': 0,
		'treeInfo': {
			'children': [
				{'val': ':=',
				'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR,
				'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
				]
				}
			]
		}
	},
	{
		'code': 'x,y=1,2',
		'numTopChildren': 1,
		'numComments': 0,
		'treeInfo': {
			'children': [
				{'val': '=',
				'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR,
				'children': [
					{'val': null, 'children': [
						{'val': 'x', 'children': []},
						{'val': ',', 'children': []},
						{'val': 'y', 'children': []}
					]},
					{'val': null, 'children': [
						{'val': '1', 'children': []},
						{'val': ',', 'children': []},
						{'val': '2', 'children': []}
					]}
				]
				}
			]
		}
	},
	{
		'code': 'x,y,z=1,2,3',
		'numTopChildren': 1,
		'numComments': 0,
		'treeInfo': {
			'children': [
				{'val': '=',
				'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR,
				'children': [
					{'val': null, 'children': [
						{'val': 'x', 'children': []},
						{'val': ',', 'children': []},
						{'val': 'y', 'children': []},
						{'val': ',', 'children': []},
						{'val': 'z', 'children': []}
					]},
					{'val': null, 'children': [
						{'val': '1', 'children': []},
						{'val': ',', 'children': []},
						{'val': '2', 'children': []},
						{'val': ',', 'children': []},
						{'val': '3', 'children': []}
					]}
				]
				}
			]
		}
	},
	{'code': 'x = 1 + 2',
		'numTopChildren': 1,
		'numComments': 0,
		'treeInfo': {
			'children': [
				{'val': '=',
				'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR,
				'children': [
					{'val': 'x', 'children': []},
					{'val': '+', 'children': [
						{'val': '1', 'children': []},
						{'val': '2', 'children': []}
					]},
				]},
			]
		}
	},
	{
		'code': 'p.x = 1',
		'treeInfo': {
			'children': [
				{'val': '=',
				'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
						{'val': 'p', 'children': []},
						{'val': '.', 'children': []},
						{'val': 'x', 'children': []}
					]},
					{'val': '1', 'children': []}
				]}
			]
		}
	},
	{'code': 'x++', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': [
					{'val': '++',
					'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR,
					'children': []
					}
				]},
			]
	}},
	{'code': 'x++\nif', 
		'treeInfo': {
			'children': [
				{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': [
					{'val': '++', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR}
				]},
				{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': []}
			]
		}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);	
}