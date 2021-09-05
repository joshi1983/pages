import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseUnaryOperators(logger) {
	const cases = [
		{'code': '!true', 'numTopChildren': 1, 'maxDepth': 3},
		{'code': '!0', 'numTopChildren': 1, 'maxDepth': 3},
		{'code': '![]', 'numTopChildren': 1, 'maxDepth': 4},
		{'code': '!{}', 'numTopChildren': 1, 'maxDepth': 4},
		{'code': '!undefined', 'numTopChildren': 1, 'maxDepth': 3},
		{'code': '!null', 'numTopChildren': 1, 'maxDepth': 3},
		{'code': '+null', 'numTopChildren': 1, 'maxDepth': 3},
		{'code': '+undefined', 'numTopChildren': 1, 'maxDepth': 3},
		{'code': '+[]', 'numTopChildren': 1, 'maxDepth': 4},
		{'code': '+{}', 'numTopChildren': 1, 'maxDepth': 4,
			'treeInfo': wrapSingleTreeInfoObject(
			{'val': '+', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
				{'val': null, 'type': ParseTreeTokenType.CURLY_BRACKET_EXPRESSION, 'children': [
					{'val': '{'},
					{'val': '}'}
				]}
			]}
		)},
		{'code': 'this.cursoredIndex++;', 'numTopChildren': 2, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
			{
				'val': 'this',
				'type': ParseTreeTokenType.THIS,
				'children': [
					{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
						{'val': 'cursoredIndex', 'type': ParseTreeTokenType.IDENTIFIER, 'children': [
							{'val': '++', 'type': ParseTreeTokenType.UNARY_OPERATOR}
						]}
					]}
				]
			},
			{'val': ';'}
		]
		}
		},
		{'code': "typeof this[methodName] === 'function'", 'numTopChildren': 1},
		{'code': 'void 8', 'numTopChildren': 1, 'maxDepth': 3,
			'treeInfo': wrapSingleTreeInfoObject(
			{'val': 'void', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
				{'val': '8', 'type': ParseTreeTokenType.NUMBER_LITERAL}
			]})
		},
		{'code': 'void (2 === "2")', 'numTopChildren': 1, 'maxDepth': 5},
	];
	processParseTestCases(cases, logger);
};