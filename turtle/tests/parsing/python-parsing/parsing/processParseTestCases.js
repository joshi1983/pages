import { parse } from
'../../../../modules/parsing/python-parsing/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases as genericProcessParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function processParseTestCases(cases, logger) {
	genericProcessParseTestCases(cases, parse, ParseTreeTokenType, logger);
};