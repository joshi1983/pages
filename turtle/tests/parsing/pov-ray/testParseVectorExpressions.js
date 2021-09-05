import { parse } from
'../../../modules/parsing/pov-ray/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/pov-ray/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseVectorExpressions(logger) {
	const cases = [
	{'code': '<-3.14,4>', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.VECTOR_EXPRESSION,
			'children': [
				{'val': '<', 'type': ParseTreeTokenType.ANGLE_LEFT_BRACKET},
				{'val': '-3.14', 'type': ParseTreeTokenType.NUMBER_LITERAL},
				{'val': ',', 'type': ParseTreeTokenType.COMMA},
				{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL},
				{'val': '>', 'type': ParseTreeTokenType.ANGLE_RIGHT_BRACKET}
			]}
		]}
	},
	{'code': '<0, 1> <', 'numTopChildren': 2, 'numComments': 0,
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.VECTOR_EXPRESSION, 'children': [
				{'val': '<', 'type': ParseTreeTokenType.ANGLE_LEFT_BRACKET},
				{'val': '0', 'type': ParseTreeTokenType.NUMBER_LITERAL},
				{'val': ',', 'type': ParseTreeTokenType.COMMA},
				{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL},
				{'val': '>', 'type': ParseTreeTokenType.ANGLE_RIGHT_BRACKET},
			]},
			{'val': null, 'type': ParseTreeTokenType.VECTOR_EXPRESSION, 'children': [
				{'val': '<', 'type': ParseTreeTokenType.ANGLE_LEFT_BRACKET},
			]}
		]
		}
	},
	{'code': '<0, 0.1> <0, 0.9>', 'numTopChildren': 2, 'numComments': 0, 'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.VECTOR_EXPRESSION,
			'children': [
				{'val': '<', 'type': ParseTreeTokenType.ANGLE_LEFT_BRACKET},
				{'val': '0', 'type': ParseTreeTokenType.NUMBER_LITERAL},
				{'val': ',', 'type': ParseTreeTokenType.COMMA},
				{'val': '0.1', 'type': ParseTreeTokenType.NUMBER_LITERAL},
				{'val': '>', 'type': ParseTreeTokenType.ANGLE_RIGHT_BRACKET}
			]},
			{'val': null, 'type': ParseTreeTokenType.VECTOR_EXPRESSION,
			'children': [
				{'val': '<', 'type': ParseTreeTokenType.ANGLE_LEFT_BRACKET},
				{'val': '0', 'type': ParseTreeTokenType.NUMBER_LITERAL},
				{'val': ',', 'type': ParseTreeTokenType.COMMA},
				{'val': '0.9', 'type': ParseTreeTokenType.NUMBER_LITERAL},
				{'val': '>', 'type': ParseTreeTokenType.ANGLE_RIGHT_BRACKET}
			]}
		]}
	},
	{'code': '#declare x = <', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': '#declare', 'type': ParseTreeTokenType.DECLARE,
			'children': [
				{'val': '=', 'children': [
					{'val': 'x'},
					{'val': null, 'type': ParseTreeTokenType.VECTOR_EXPRESSION, 
						'children': [
							{'val': '<'}
					]}
				]}
			]}
		]
	}},
	{'code': '#declare x = < 0,', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': '#declare', 'type': ParseTreeTokenType.DECLARE,
			'children': [
				{'val': '=', 'children': [
					{'val': 'x'},
					{'val': null, 'type': ParseTreeTokenType.VECTOR_EXPRESSION, 
						'children': [
							{'val': '<'},
							{'val': '0'},
							{'val': ','},
						]}
				]}
			]}
		]
	}}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};