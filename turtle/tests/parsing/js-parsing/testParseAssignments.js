import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseAssignments(logger) {
	const cases = [
		{'code': 'let = 3', 'numTopChildren': 1,
			'treeInfo': {
				'children': [
					{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
						{'val': 'let', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]}
				]
			}
		},
		{'code': `d = 2
q = 3`, 'numTopChildren': 2},
		{'code': `d = "hello"
q = 3`, 'numTopChildren': 2},
		{'code': `d = \`hello\`
q = 3`, 'numTopChildren': 2},
		{'code': `d = true
q = 3`, 'numTopChildren': 2},
		{'code': `d = f()
q = 3`, 'numTopChildren': 2},
		{'code': `d = (1 + 5)
q = 3`, 'numTopChildren': 2},
		{'code': `d = a
q = 3`, 'numTopChildren': 2}
	];
	processParseTestCases(cases, logger);
};