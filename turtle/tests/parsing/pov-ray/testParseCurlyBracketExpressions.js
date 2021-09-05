import { parse } from
'../../../modules/parsing/pov-ray/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/pov-ray/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseCurlyBracketExpressions(logger) {
	const cases = [
	{'code': '{}', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
				'children': [
					{'val': '{', 'type': ParseTreeTokenType.CURLY_LEFT_BRACKET},
					{'val': '}', 'type': ParseTreeTokenType.CURLY_RIGHT_BRACKET}
				]}
			]
	}},
	{'code': '{White}', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
				'children': [
					{'val': '{', 'type': ParseTreeTokenType.CURLY_LEFT_BRACKET},
					{'val': 'White'},
					{'val': '}', 'type': ParseTreeTokenType.CURLY_RIGHT_BRACKET}
				]}
			]
	}},
	{'code': '{White,3}', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
			'children': [
				{'val': '{', 'type': ParseTreeTokenType.CURLY_LEFT_BRACKET},
				{'val': 'White'},
				{'val': ',', 'type': ParseTreeTokenType.COMMA},
				{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL},
				{'val': '}', 'type': ParseTreeTokenType.CURLY_RIGHT_BRACKET}
			]}
		]
	}},
	{'code': '{< 0.00, 0.50>}', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
			'children': [
				{'val': '{', 'type': ParseTreeTokenType.CURLY_LEFT_BRACKET},
				{'val': null, 'children': [
					{'val': '<'},
					{'val': '0.00'},
					{'val': ','},
					{'val': '0.50'},
					{'val': '>'}
				]},
				{'val': '}', 'type': ParseTreeTokenType.CURLY_RIGHT_BRACKET}
			]}
		]
	}},
	{'code': 'camera {location < 0.00, 0.50>}', 'numTopChildren': 1, 'numComments': 0},
	{'code': 'camera {location  < 0.00, 0.50,-1.00>}', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': 'camera', 'type': ParseTreeTokenType.PARAMETERIZED_GROUP, 'children': [
				{'val': null, 'type': ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
				'children': [
					{'val': '{'},
					{'val': 'location', 'children': [
						{'val': null, 'type': ParseTreeTokenType.VECTOR_EXPRESSION,
						'children': [
							{'val': '<', 'type': ParseTreeTokenType.ANGLE_LEFT_BRACKET},
							{'val': '0.00', 'type': ParseTreeTokenType.NUMBER_LITERAL},
							{'val': ',', 'type': ParseTreeTokenType.COMMA},
							{'val': '0.50', 'type': ParseTreeTokenType.NUMBER_LITERAL},
							{'val': ',', 'type': ParseTreeTokenType.COMMA},
							{'val': '-1.00', 'type': ParseTreeTokenType.NUMBER_LITERAL},
							{'val': '>', 'type': ParseTreeTokenType.ANGLE_RIGHT_BRACKET},
						]}
					]},
					{'val': '}'}
				]}
			]
			}
		]
	}},
	{'code': '#declare Camera_1 = camera {',
	'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': '#declare', 'children': [
				{'val': '=', 'children': [
					{'val': 'Camera_1'},
					{'val': 'camera', 'children': [
						{'val': null, 'type': ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
						'children': [
							{'val': '{'}
						]}
					]}
				]}
			]}
		]
	}}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};