import { parse } from
'../../../../../../modules/parsing/other-languages/pascal/turing/parsing/parse.js';
import { processParseTestCases as generalProcessParseTestCases } from
'../../../../../helpers/parsing/processParseTestCases.js';
import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function processParseTestCases(cases, logger) {
	generalProcessParseTestCases(cases, parse, ParseTreeTokenType, logger);
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = parse(caseInfo.code);
		if (typeof result !== 'object') {
			plogger(`Expected result to be an object but result=${result}`);
		}
	});
};