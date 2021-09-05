import { ParseTreeTokenType } from '../../../modules/parsing/kturtle/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseRepeat(logger) {
	const cases = [{
		'code': 'repeat 4 {}',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'repeat', 'type': ParseTreeTokenType.REPEAT, 'children': [
					{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL},
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