import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseGet(logger) {
	const cases = [
	{
		'code': 'GET (x1%, y1%)-(x2%, y2%), Box%',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'GET', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST,
						'children': [
						{'val': '-', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': null, 'type': ParseTreeTokenType.TUPLE_LITERAL, 'children': [
								{'val': '('},
								{'val': 'x1%'},
								{'val': ','},
								{'val': 'y1%'},
								{'val': ')'}
							]},
							{'val': null, 'type': ParseTreeTokenType.TUPLE_LITERAL, 'children': [
								{'val': '('},
								{'val': 'x2%'},
								{'val': ','},
								{'val': 'y2%'},
								{'val': ')'}
							]},
						]},
						{'val': ',', 'children': []},
						{'val': 'Box%', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					]}
				]}
			]}
	},{
		'code': '1460 GET (150,90)-(170,110),A',
		'numTopChildren': 2,
		'treeInfo': {
			'children': [
				{'val': '1460', 'type': ParseTreeTokenType.LABEL, 'children': []},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'GET', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
				]}
		]}
	}];
	processParseTestCases(cases, logger);
};

