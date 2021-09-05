import { parse } from
'../../../modules/parsing/qbasic/parse.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';
import { processParseTestCases as generalProcessParseTestCases } from
'../../helpers/parsing/processParseTestCases.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/qbasic/ParseTreeTokenType.js';

function isOfInterest(caseInfo) {
	if (caseInfo.numStatementSeparators !== undefined)
		return true;
	return false;
}

export function processParseTestCases(cases, logger) {
	generalProcessParseTestCases(cases, parse, ParseTreeTokenType, logger);
	cases.forEach(function(caseInfo, index) {
		if (!isOfInterest(caseInfo))
			return;
		const parseResult = parse(caseInfo.code);
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		if (caseInfo.numStatementSeparators !== parseResult.statementSeparators.length)
			plogger(`Expected ${caseInfo.numStatementSeparators} separators but found ${parseResult.statementSeparators.length}`);
	});
};