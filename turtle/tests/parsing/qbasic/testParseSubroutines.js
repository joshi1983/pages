import { ParseTreeTokenType } from
'../../../modules/parsing/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseSubroutines(logger) {
	const cases = [{
		'code': `SUB name (params)
END SUB`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'SUB', 'type': ParseTreeTokenType.SUB, 'children': [
					{'val': 'name', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '('},
						{'val': 'params'},
						{'val': ')'},
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.END_SUB, 'children': [
						{'val': 'END'},
						{'val': 'SUB'}
					]}
				]},
			]
		}
	}];
	processParseTestCases(cases, logger);
};