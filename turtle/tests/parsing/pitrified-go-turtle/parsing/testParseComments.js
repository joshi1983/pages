import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseComments(logger) {
	const cases = [
		{'code': '// comment', 'numTopChildren': 0, 'numComments': 1},
		{'code': '// comment\n// another comment', 'numTopChildren': 0, 'numComments': 2},
		{'code': '/* a multiline comment */', 'numTopChildren': 0, 'numComments': 1},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};