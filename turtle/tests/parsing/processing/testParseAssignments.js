import { ParseTreeTokenType } from
'../../../modules/parsing/processing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseAssignments(logger) {
	const cases = [
		{'code': `d = 2
q = 3`, 'numTopChildren': 2},
		{'code': `d = "hello"
q = 3`, 'numTopChildren': 2},
		{'code': `d = true
q = 3`, 'numTopChildren': 2},
		{'code': `d = f()
q = 3`, 'numTopChildren': 2},
		{'code': `d = (1 + 5)
q = 3`, 'numTopChildren': 2},
		{'code': `d = a
q = 3`, 'numTopChildren': 2},
		{'code': 'this.x = 4', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject(
			{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR,
			'children': [
				{'val': 'this', 'type': ParseTreeTokenType.THIS,
				'children': [
					{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER}
					]}
				]},
				{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
			]}
		)}
	];
	processParseTestCases(cases, logger);
};