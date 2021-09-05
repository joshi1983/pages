import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseTernaryOperator(logger) {
	const ternaryExpressionInfo = {'val': null, 'type': ParseTreeTokenType.CONDITIONAL_TERNARY, 'children': [
		{'val': '>', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
			{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL},
			{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL}
		]},
		{'val': '?', 'type': ParseTreeTokenType.QUESTION_MARK},
		{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL},
		{'val': ':', 'type': ParseTreeTokenType.COLON},
		{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL}
	]};
	const cases = [
		{'code': 'false ? 4 : 5', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'val': null,
			'children': [
				{'type': ParseTreeTokenType.CONDITIONAL_TERNARY, 'val': null, 'children': [
					{'type': ParseTreeTokenType.BOOLEAN_LITERAL, 'val': 'false'},
					{'type': ParseTreeTokenType.QUESTION_MARK, 'val': '?'},
					{'type': ParseTreeTokenType.NUMBER_LITERAL, 'val': '4'},
					{'type': ParseTreeTokenType.COLON, 'val': ':'},
					{'type': ParseTreeTokenType.NUMBER_LITERAL, 'val': '5'}
				]}
			]
		}},
		{'code': '1>2?3:4', 'numTopChildren': 1, 'maxDepth': 4, 'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				ternaryExpressionInfo
			]
		}},
		{'code': '(1>2?3:4)', 'numTopChildren': 1, 'maxDepth': 5, 'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
					{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
					ternaryExpressionInfo,
					{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
				]
				}
			]
		}},
		{'code': 'console.log(1>2?3:4)', 'numTopChildren': 1, 'maxDepth': 6, 'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'console', 'children': [
						{'val': '.', 'children': [
							{'val': 'log', 'children': [
							]}
						]}
					]},
					{'val': null, 'children': [
						{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
						ternaryExpressionInfo,
						{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
					]}
				]}
			]
		}},
		{'code': 'true ? titleInfo.text : titleInfo', 'numTopChildren': 1},
		{'code': 'true ? titleInfo.text : titleInfo;', 'numTopChildren': 2},
		{'code': 'true ? f() : titleInfo', 'numTopChildren': 1},
		{'code': 'true ? o.f() : titleInfo', 'numTopChildren': 1},
		{'code': 'true ? o.f()[0] : titleInfo', 'numTopChildren': 1},
		{'code': 'true ? o.f()[1][2]() : titleInfo', 'numTopChildren': 1},
		{'code': 'true ? o.f()[1][2]() : titleInfo.x()[3][4]()', 'numTopChildren': 1},
		{'code': 'true ? o.f()[1][2]().y : titleInfo.x()[3][4]().z', 'numTopChildren': 1},
		{'code': "x === '' ? 'empty' : 'non-empty'", 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
			'val': null, 'type': ParseTreeTokenType.CONDITIONAL_TERNARY,
			'children': [
				{'val': '===', 'children': [
					{'val': 'x'},
					{'val': "''"}
				]},
				{'val': '?'},
				{'val': "'empty'"},
				{'val': ':'},
				{'val': "'non-empty'"}
			]
		})},
		{'code': "x => x === '' ? '' : ' ' + x", 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
			'val': '=>', 'type': ParseTreeTokenType.BINARY_OPERATOR,
			'children': [
				{'val': 'x'},
				{'val': null, 'type': ParseTreeTokenType.CONDITIONAL_TERNARY, 'children': [
					{'val': '==='},
					{'val': '?'},
					{'val': "''"},
					{'val': ':'},
					{'val': "+"}
				]}
			]
		})},
		{'code': "y = x === '' ? '' : ' ' + x", 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
			'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR,
			'children': [
				{'val': 'y'},
				{'val': null, 'type': ParseTreeTokenType.CONDITIONAL_TERNARY, 'children': [
					{'val': '==='},
					{'val': '?'},
					{'val': "''"},
					{'val': ':'},
					{'val': "+"}
				]}
			]
		})}
	];
	processParseTestCases(cases, logger);
};