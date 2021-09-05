import { ParseTreeTokenType } from '../../../modules/parsing/kturtle/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseWhile(logger) {
	const cases = [{
		'code': 'while true {}',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'while', 'type': ParseTreeTokenType.WHILE, 'children': [
					{'val': 'true', 'type': ParseTreeTokenType.BOOLEAN_LITERAL},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{'},
						{'val': '}'}
					]}
				]},
			]
		}
	}];
	processParseTestCases(cases, logger);
};