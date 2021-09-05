import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseSelect(logger) {
	const cases = [
		{'code': 'select {}', 'treeInfo': {
			'children': [
				{'val': 'select', 'type': ParseTreeTokenType.SELECT, 'children': [
					{'val': null, 'type': ParseTreeTokenType.SELECT_BODY, 'children': [
						{'val': '{', 'children': []},
						{'val': '}', 'children': []}
					]}
				]}
			]}
		}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};