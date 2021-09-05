import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseVar(logger) {
	const cases = [
	{'code': 'var x', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'var', 'type': ParseTreeTokenType.VAR,
				'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
				]
				}
			]
	}},
	{'code': 'var x int', 'numTopChildren': 1, 'numComments': 0,'treeInfo': {
		'children': [
			{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
				{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': [
					{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
						{'val': 'int', 'children': []}
					]}
				]}
			]}
		]
	}},
	{'code': 'var i int = 0', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
		'children': [
			{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
					{'val': 'i', 'type': ParseTreeTokenType.IDENTIFIER, 'children': [
						{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
							{'val': 'int', 'children': []}
						]}
					]},
					{
						'val': '0', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []
					}
				]}
			]}
		]
	}},
	{'code': 'var i, j int = 1', 'treeInfo': {
		'children': [
			{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
				{'val': 'i', 'children': []},
				{'val': ',', 'children': []},
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
					{'val': 'j', 'children': [
						{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
							{'val': 'int', 'children': []}
						]}
					]},
					{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
				]}
			]}
		]
		}
	},
	{
		'code': 'var Lname = "Go Language"',
		 'treeInfo': {
				'children': [
					{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
						{'val': '=', 'children': [
							{'val': 'Lname', 'children': []},
							{'val': '"Go Language"', 'children': []},
						]}
					]}
				]
		 }
	},
	{
		'code': 'var i, j int = 1',
		'treeInfo': {
			'children': [
				{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
					{'val': 'i', 'children': []},
					{'val': ',', 'children': []},
					{'val': '=', 'children': [
						{'val': 'j', 'children': [
							{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
								{'val': 'int', 'children': []}
							]}
						]},
						{'val': '1', 'children': []}
					]}
				]}
			]
		}
	},
	{
		'code': 'var i, j int = 1',
		'treeInfo': {
			'children': [
				{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
					{'val': 'i', 'children': []},
					{'val': ',', 'children': []},
					{'val': '=', 'children': [
						{'val': 'j', 'children': [
							{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
								{'val': 'int', 'children': []}
							]}
						]},
						{'val': '1', 'children': []}
					]}
				]}
			]
		}
	},
	{
		'code': 'var i, j int = 1, 2',
		'treeInfo': {
			'children': [
				{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
					{'val': '=', 'children': [
						{'val': null, 'type': ParseTreeTokenType.COMMA_EXPRESSION, 'children': [
							{'val': 'i', 'children': []},
							{'val': ',', 'children': []},
							{'val': 'j', 'children': [
								{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
									{'val': 'int', 'children': []}
								]}
							]}
						]},
						{'val': null, 'type': ParseTreeTokenType.COMMA_EXPRESSION, 'children': [
							{'val': '1', 'children': []},
							{'val': ',', 'children': []},
							{'val': '2', 'children': []}
						]	
						}
					]}
				]}
			]
		}
	},
	{
		'code': `func main() {
    var a [5]int
    print()`,
		'treeInfo': {
			'children': [
				{'val': 'func', 'type': ParseTreeTokenType.FUNC, 'children': [
					{'val': 'main'},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{'},
						{'val': 'var'},
						{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
							{'val': 'print'},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
						]}
					]}
				]}
			]}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};