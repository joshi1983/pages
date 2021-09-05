import { ParseTreeTokenType } from
'../../../modules/parsing/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseShared(logger) {
	const cases = [{
		'code': `shared x`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'shared', 'type': ParseTreeTokenType.SHARED, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]},
			]
		}
	},{
		'code': `shared x,y`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'shared', 'type': ParseTreeTokenType.SHARED, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
					{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
				]},
			]
		}
	}];
	processParseTestCases(cases, logger);
};