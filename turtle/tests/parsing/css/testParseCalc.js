import { parse } from
'../../../modules/parsing/css/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/css/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseCalc(logger) {
	const cases = [
	{'code': 'calc(2em * 5)', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'children': [
				{'val': 'calc', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
					{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
					{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': '2em', 'type': ParseTreeTokenType.NUMBER_UNIT_LITERAL},
						{'val': '5', 'type': ParseTreeTokenType.NUMBER_LITERAL}
					]},
					{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
				]}
			]},
		]
	}},
	{'code': 'calc(100% - 32px)', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'children': [
				{'val': 'calc', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
					{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
					{'val': '-', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': '100%', 'type': ParseTreeTokenType.NUMBER_UNIT_LITERAL},
						{'val': '32px', 'type': ParseTreeTokenType.NUMBER_UNIT_LITERAL}
					]},
					{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
				]}
			]},
		]
	}},
	{'code': 'calc(var(--predefined-width) - calc(16px * 2))', 'numTopChildren': 1, 'numComments': 0,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'children': [
					{'val': 'calc', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
						{'val': '-', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL,
							'children': [
								{'val': 'var', 'type': ParseTreeTokenType.IDENTIFIER},
								{'val': null, 'type': ParseTreeTokenType.ARG_LIST,
								'children': [
									{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
									{'val': '--predefined-width', 'type': ParseTreeTokenType.IDENTIFIER},
									{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET},
								]},
							]},
							{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL,
							'children': [
								{'val': 'calc', 'type': ParseTreeTokenType.IDENTIFIER},
								{'val': null, 'type': ParseTreeTokenType.ARG_LIST,
								'children': [
									{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
									{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR,
									'children': [
										{'val': '16px', 'type': ParseTreeTokenType.NUMBER_UNIT_LITERAL},
										{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL}
									]},
									{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET},
								]}
							]}
						]},
						{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
					]}
				]},
			]
	}},
	{'code': 'calc(2*3-2)', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'children': [
				{'val': 'calc', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
					{'val': '('},
					{'val': '-', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL},
							{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]},
						{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL}
					]},
					{'val': ')'}
				]}
			]}
		]
	}
	},
	{'code': 'calc(2*3+2)', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'children': [
				{'val': 'calc', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
					{'val': '('},
					{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL},
							{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]},
						{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL}
					]},
					{'val': ')'}
				]}
			]}
		]
	}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};