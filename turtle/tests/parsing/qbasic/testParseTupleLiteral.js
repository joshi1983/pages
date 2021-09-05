import { ParseTreeTokenType } from
'../../../modules/parsing/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseTupleLiteral(logger) {
	const cases = [{
		'code': 'CIRCLE (x, y),',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'CIRCLE', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': null, 'type': ParseTreeTokenType.TUPLE_LITERAL, 'children': [
							{'val': '('},
							{'val': 'x'},
							{'val': ','},
							{'val': 'y'},
							{'val': ')'},
						]},
						{'val': ','},
					]},
				]},
			]
		}
	}];
	processParseTestCases(cases, logger);
};