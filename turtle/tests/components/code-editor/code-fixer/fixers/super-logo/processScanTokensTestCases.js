import { LogoScanner } from
'../../../../../../modules/parsing/LogoScanner.js';
import { ParseLogger } from
'../../../../../../modules/parsing/loggers/ParseLogger.js';
import { processScanTokensTestCases as processScanTokensTestCases_ } from
'../../../../../parsing/processScanTokensTestCases.js';

function scan(code) {
	const parseLogger = new ParseLogger();
	return LogoScanner.scan(code, parseLogger);
}

export const processScanTokensTestCases = processScanTokensTestCases_(scan);