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
	{'code': 'for len(remaining) > 0',
	'numTopChildren': 1,
	'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'for', 'type': ParseTreeTokenType.FOR,
				'children': [
					{'val': '>', 'children': [
						{'val': null, 'children': [
							{'val': 'len', 'children': []},
							{'val': null, 'children': [
								{'val': '(', 'children': []},
								{'val': 'remaining', 'children': []},
								{'val': ')', 'children': []}
							]}
						]},
						{'val': '0', 'children': []}
					]}
				]
				}
			]
	 }
	},{
		'code': 'for _,',
		'treeInfo': {
			'children': [
				{'val': 'for', 'type': ParseTreeTokenType.FOR,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.COMMA_EXPRESSION, 'children': [
						{'val': '_', 'children': []},
						{'val': ',', 'children': []}
					]}
				]}
			]
		}
	},{
		'code': 'for _, num := range nums {}',
		'treeInfo': {
			'children': [
				{'val': 'for', 'type': ParseTreeTokenType.FOR,
				'children': [
					{'val': ':='},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
				]
				}
			]
		}
	},{
		'code': `func main() {
    for _, i := range []int{7, 42} {
    }
}`,
		'treeInfo': {
			'children': [
				{'val': 'func', 'type': ParseTreeTokenType.FUNC,
				'children': [
					{'val': 'main', 'children': []},
					{'val': null, 'type':ParseTreeTokenType.ARG_LIST},
					{'val': null, 'type':ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []},
						{'val': 'for', 'type': ParseTreeTokenType.FOR,
						'children': [
							{'val': ':=', 'children': [
								{
									'val': null,
									'type': ParseTreeTokenType.COMMA_EXPRESSION
								},
								{'val': 'range','children': [
									{'val': null, 'type': ParseTreeTokenType.ARRAY_LITERAL,
									'children': [
										{'val': null, 'type': ParseTreeTokenType.ARRAY_SUBSCRIPT},
										{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION},
										{'val': null, 'type': ParseTreeTokenType.ARRAY_VALUES_BLOCK}
									]}
								]}
							]},
							{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
						]},
						{'val': '}', 'children': []}
					]
					}
				]
				}
			]
		}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};