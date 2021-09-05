import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseDoWhileLoops(logger) {
	const cases = [
		{'code': 'do {} while (true)', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.DO, 'val': 'do',
					'children': [
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
							{'val': '{'},
							{'val': '}'}
						]},
						{'val': 'while', 'type': ParseTreeTokenType.WHILE, 'children': [
							{'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'val': null, 'children': [
								{'val': '('},
								{'type': ParseTreeTokenType.BOOLEAN_LITERAL, 'val': 'true'},
								{'val': ')'}
							]}
						]}
					]
				}
			]
			}},
	];
	processParseTestCases(cases, logger);
};