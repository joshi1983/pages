import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseOption(logger) {
	const cases = [{
		'code': 'OPTION _explicit\n20',
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'OPTION', 'type': ParseTreeTokenType.OPTION, 'children': [
					{'val': '_explicit', 'children': []},
				]},
				{'val': '20', 'type': ParseTreeTokenType.LABEL, 'children': []}
			]
		}
	},{
		'code': 'OPTION _EXPLICITARRAY',
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'OPTION', 'type': ParseTreeTokenType.OPTION, 'children': [
					{'val': '_EXPLICITARRAY', 'children': []},
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};