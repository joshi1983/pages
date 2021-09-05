import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseWhileLoops(logger) {
	const cases = [
		{'code': 'while (true) {}', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.WHILE, 'val': 'while',
					'children': [
						{'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'val': null, 'children': [
							{'val': '('},
							{'type': ParseTreeTokenType.BOOLEAN_LITERAL, 'val': 'true'},
							{'val': ')'}
						]},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
							{'val': '{'},
							{'val': '}'}
						]}
					]
				}
			]
			}},
		{'code': 'while (true);', 'numTopChildren': 2, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.WHILE, 'val': 'while',
					'children': [
						{'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'val': null, 'children': [
							{'val': '('},
							{'type': ParseTreeTokenType.BOOLEAN_LITERAL, 'val': 'true'},
							{'val': ')'}
						]},
					]
				},
				{'val': ';', 'type': ParseTreeTokenType.SEMICOLON, 'children': []}
			]
			}},
		{'code': 'while (true) ++i', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.WHILE, 'val': 'while',
					'children': [
						{'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'val': null, 'children': [
							{'val': '('},
							{'type': ParseTreeTokenType.BOOLEAN_LITERAL, 'val': 'true'},
							{'val': ')'}
						]},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
							{'val': '++', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
								{'type': ParseTreeTokenType.IDENTIFIER, 'val': 'i'}
							]}
						]}
					]
				},
			]
		}},
		{'code': `while (true) {} f()`, 'numTopChildren': 2},
		{'code': `while (true) {} this.f()`, 'numTopChildren': 2},
	];
	processParseTestCases(cases, logger);
};