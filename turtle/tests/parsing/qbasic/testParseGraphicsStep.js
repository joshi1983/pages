import { ParseTreeTokenType } from
'../../../modules/parsing/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

/*
STEP is often used in for-loops to indicate the amount of change in a counter's value between iterations.
These test cases involve STEP used to indicate a point.
*/
export function testParseGraphicsStep(logger) {
	const cases = [{
		'code': 'CIRCLE STEP(0, 0), 5, 12',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'CIRCLE', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST,
						'children': [
							{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
								{'val': 'STEP', 'children': []},
								{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
									{'val': '('},
									{'val': '0'},
									{'val': ','},
									{'val': '0'},
									{'val': ')'}
								]}
							]},
							{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
							{'val': '5', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
							{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
							{'val': '12', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
						]
					}
				]}
			]},
	},{
		'code': 'LINE STEP(',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'LINE', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST,
						'children': [
							{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
								{'val': 'STEP', 'children': []},
								{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
									{'val': '('},
								]}
							]}
						]
					}
				]}
			]}
	}];
	processParseTestCases(cases, logger);
};