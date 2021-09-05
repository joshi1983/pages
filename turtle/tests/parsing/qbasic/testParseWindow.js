import { ParseTreeTokenType } from
'../../../modules/parsing/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseWindow(logger) {
	const cases = [{
		'code': 'WINDOW (-4, 0)-',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'WINDOW', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST,
						'children': [
							{'val': '-', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
								{'val': null, 'type': ParseTreeTokenType.TUPLE_LITERAL, 'children': [
									{'val': '('},
									{'val': '-4'},
									{'val': ','},
									{'val': '0'},
									{'val': ')'}
								]}
							]}
						]
					}
				]}
			]}
	}];
	processParseTestCases(cases, logger);
};