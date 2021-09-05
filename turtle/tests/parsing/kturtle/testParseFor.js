import { ParseTreeTokenType } from '../../../modules/parsing/kturtle/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseFor(logger) {
	const cases = [{
		'code': 'for $x = 1 to 10 {}',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'for', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'to', 'type': ParseTreeTokenType.TO, 'children': [
						{'val': '=', 'children': [
							{'val': '$x'},
							{'val': '1'}
						]},
						{
							'val': '10'
						}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{'},
						{'val': '}'}
					]}
				]},
			]
		}
	}, {
		'code': 'for $x = 1 + 4 to 10 + $xyz {}',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'for', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'to', 'type': ParseTreeTokenType.TO, 'children': [
						{'val': '=', 'children': [
							{'val': '$x'},
							{'val': '+', 'children': [
								{'val': '1'},
								{'val': '4'}
							]}
						]},
						{
							'val': '+',
							'children': [
								{'val': '10'},
								{'val': '$xyz'}
							]
						}
					]},
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