import { ParseTreeTokenType } from '../../../../modules/parsing/other-languages/kturtle/ParseTreeTokenType.js';
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
	},{
		'code': 'repeat 4 {} forward 100',
		'numTopChildren': 2
	},{
		'code': 'repeat 4 {} if true {}',
		'numTopChildren': 2
	},{
		'code': 'repeat 4 {} learn x {}',
		'numTopChildren': 2
	},{
		'code': 'repeat 4 {} repeat 2 {}',
		'numTopChildren': 2
	},{
		'code': 'repeat 4 {} for $y = 2 to 20 {}',
		'numTopChildren': 2
	},{
		'code': 'repeat 4 {} while 1 < 2 {}',
		'numTopChildren': 2
	}]; 
	processParseTestCases(cases, logger);
};