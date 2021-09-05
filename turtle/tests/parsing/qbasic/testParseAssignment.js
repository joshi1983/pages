import { ParseTreeTokenType } from
'../../../modules/parsing/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseAssignment(logger) {
	const cases = [{
		'code': 'z(i) = 1',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
					{'val': null},
					{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL}
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};