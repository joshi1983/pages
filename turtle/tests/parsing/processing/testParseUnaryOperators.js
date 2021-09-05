import { ParseTreeTokenType } from '../../../modules/parsing/processing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseUnaryOperators(logger) {
	const cases = [
		{'code': '!true', 'numTopChildren': 1, 'maxDepth': 3, 'treeInfo': wrapSingleTreeInfoObject({
			'val': '!',
			'type': ParseTreeTokenType.UNARY_OPERATOR,
			'children': [
				{'val': 'true', 'type': ParseTreeTokenType.BOOLEAN_LITERAL}
			]
		})
		},
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
	];
	processParseTestCases(cases, logger);
};