import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseFunctionCalls(logger) {
	const cases = [{
		'code': `rect 1,2,3,4`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'rect', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
						{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
						{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
						{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
						{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
						{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
						{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]},
				]},
			]
		}
	}];
	processParseTestCases(cases, logger);
};