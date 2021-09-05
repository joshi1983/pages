import { parse } from
'../../../../../modules/parsing/other-languages/python/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../../modules/parsing/other-languages/python/ParseTreeTokenType.js';
import { processParseTestCases as genericProcessParseTestCases } from
'../../../../helpers/parsing/processParseTestCases.js';

export function processParseTestCases(cases, logger) {
	genericProcessParseTestCases(cases, parse, ParseTreeTokenType, logger);
};