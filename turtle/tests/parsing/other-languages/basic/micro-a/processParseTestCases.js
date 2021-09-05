import { parse } from
'../../../../../modules/parsing/other-languages/basic/qbasic/parse.js';
import { processParseTestCases as generalProcessParseTestCases } from
'../../../../helpers/parsing/processParseTestCases.js';
import { ParseTreeTokenType } from
'../../../../../modules/parsing/other-languages/basic/qbasic/ParseTreeTokenType.js';
import { scan } from
'../../../../../modules/parsing/other-languages/basic/micro-a/scanning/scan.js';
import { scanTokensToCode } from
'../../../../../modules/parsing/other-languages/basic/helpers/scanTokensToCode.js';

/*
This doesn't just parse.
This partially translates the inputted Micro(A) BASIC code to QBASIC too.
*/
function microAParse(code) {
	const tokens = scan(code);
	const parseResult = parse(scanTokensToCode(tokens));
	return parseResult;
}

export function processParseTestCases(cases, logger) {
	generalProcessParseTestCases(cases, microAParse, ParseTreeTokenType, logger);
};