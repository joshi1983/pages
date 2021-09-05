import { parse } from
'../../../modules/parsing/pov-ray/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/pov-ray/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseTernary(logger) {
	const cases = [
	{'code': '#debug 2 < 3 ? 4 : 5',
'numTopChildren': 1, 'numComments': 0,
'treeInfo': {
	'children': [
		{'val': '#debug',
		'children': [
			{'val': null, 'type': ParseTreeTokenType.CONDITIONAL_TERNARY,
			'children': [
				{'val': '<', 'type': ParseTreeTokenType.BINARY_OPERATOR,
				'children': [
					{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL}
				]},
				{'val': '?', 'type': ParseTreeTokenType.QUESTION_MARK},
				{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL},
				{'val': ':', 'type': ParseTreeTokenType.COLON},
				{'val': '5', 'type': ParseTreeTokenType.NUMBER_LITERAL}
			]}
		]}
	]
}},
	{'code': 'Foo < Bar ? <1,2,3> : <5,6,7>', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'children': [
			{'val': null,
			'children': [
				{'val': '<'},
				{'val': '?'},
				{'val': null,
				'children': [
					{'val': '<'},
					{'val': '1'},
					{'val': ','},
					{'val': '2'},
					{'val': ','},
					{'val': '3'},
					{'val': '>'}
				]},
				{'val': ':'},
				{'val': null,
				'children': [
					{'val': '<'},
					{'val': '5'},
					{'val': ','},
					{'val': '6'},
					{'val': ','},
					{'val': '7'},
					{'val': '>'}
				]}
			]}
		]
	}}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};