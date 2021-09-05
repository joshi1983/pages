import { ParseTreeTokenType } from
'../../../../modules/parsing/other-languages/kturtle/ParseTreeTokenType.js';
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
	},{
		'code': 'while true {} for $y = 2 to 20 {}',
		'numTopChildren': 2
	},{
		'code': 'while true {} forward 100',
		'numTopChildren': 2
	},{
		'code': 'while true {} if true {}',
		'numTopChildren': 2
	},{
		'code': 'while true {} learn x {}',
		'numTopChildren': 2
	},{
		'code': 'while true {} repeat 2 {}',
		'numTopChildren': 2
	},{
		'code': 'while true {} while 1 < 2 {}',
		'numTopChildren': 2
	}];
	processParseTestCases(cases, logger);
};