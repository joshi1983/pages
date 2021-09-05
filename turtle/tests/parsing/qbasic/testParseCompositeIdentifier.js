import { ParseTreeTokenType } from
'../../../modules/parsing/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseCompositeIdentifier(logger) {
	const cases = [{
		'code': 'line input',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': null, 'type': ParseTreeTokenType.COMPOSITE_IDENTIFIER, 'children': [
						{'val': 'line', 'children': []},
						{'val': 'input', 'children': []},
					]},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []}
				]}
			]}
	}];
	processParseTestCases(cases, logger);
};