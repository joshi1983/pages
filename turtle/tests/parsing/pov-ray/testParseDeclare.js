import { parse } from
'../../../modules/parsing/pov-ray/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/pov-ray/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseDeclare(logger) {
	const cases = [
	{'code': '#declare x', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '#declare', 'type': ParseTreeTokenType.DECLARE,
				'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
				]
				}
			]
	}},
	{'code': '#declare x=', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '#declare', 'type': ParseTreeTokenType.DECLARE,
				'children': [
					{'val': '=', 'type': ParseTreeTokenType.BINARY_OPERATOR,
						'children': [
							{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
						]
					}
				]
				}
			]
	}},
	{'code': '#declare x=3', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '#declare', 'type': ParseTreeTokenType.DECLARE,
				'children': [
					{'val': '=', 'type': ParseTreeTokenType.BINARY_OPERATOR,
						'children': [
							{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
							{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL},
						]}
				]
				}
			]
	}},
	{'code': '#declare x = texture{ rgb<',
	'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': '#declare', 'type': ParseTreeTokenType.DECLARE,
			'children': [
				{'val': '=', 'children': [
					{'val': 'x'},
					{'val': 'texture', 'children': [
						{'val': null, 'type': ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
						'children': [
							{'val': '{'},
							{'val': 'rgb',
							'children': [
								{'val': null, 'type': ParseTreeTokenType.VECTOR_EXPRESSION},
							]},
						]}
					]}
				]}
			]
			}
		]}
	},
	{'code': '#declare x = sqrt( 3/8 ) * y', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'children': [
			{'val': '#declare', 'type': ParseTreeTokenType.DECLARE,
			'children': [
				{'val': '=', 'type': ParseTreeTokenType.BINARY_OPERATOR,
				'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR,
					'children': [
						{'val': 'sqrt', 'type': ParseTreeTokenType.PARAMETERIZED_GROUP,
						'children': [
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST,
							'children': [
								{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
								{'val': '/', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
									{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL},
									{'val': '8', 'type': ParseTreeTokenType.NUMBER_LITERAL}
								]},
								{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET},
							]}
						]},
						{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER}
					]}
				]}
			]}
		]
	}},
	{'code': '#declare x[3]=', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '#declare', 'type': ParseTreeTokenType.DECLARE,
				'children': [
					{'val': '=', 'type': ParseTreeTokenType.BINARY_OPERATOR,
						'children': [
							{'val': null, 'type': ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
							'children': [
								{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
								{'val': null, 'type': ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION,
								'children': [
									{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET},
									{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL},
									{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET}
								]},
							]}
						]
					}
				]
				}
			]
	}},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};