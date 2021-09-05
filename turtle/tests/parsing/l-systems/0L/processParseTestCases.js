import { parse } from
'../../../../modules/parsing/l-systems/0L/parse.js';
import { processParseTestCases as generalProcessParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/l-systems/0L/ParseTreeTokenType.js';

export function processParseTestCases(cases, logger) {
	generalProcessParseTestCases(cases, parse, ParseTreeTokenType, logger);
};