import { parse } from
'../../../../modules/parsing/kojo/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/kojo/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseVar(logger) {
	const cases = [
	{'code': 'var a: Int = 20',
		'treeInfo': {
			'children': [
				{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
					{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
						{'val': 'a', 'children': [
							{'val': ':'}
						]},
						{'val': '20', 'children': []}
					]}
				]}
			]
		}
	}];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};