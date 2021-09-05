import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { TestParseLogger } from '../helpers/TestParseLogger.js';

export function testCreateParameterizedGroupsParseErrors(logger) {
	const cases = [
		{
			'code': 'to p :size\nend',
			'numErrors': 0
		},
		{
			'code': 'to p :size\nto\nend',
			'numErrors': 1
		}
	];
	cases.forEach(function(caseInfo, index) {
		const code = caseInfo.code;
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const parseLogger = new TestParseLogger(plogger, code, true);
		parseLogger.isLoggingErrors = false;
		// don't treat parse errors like they are test failures.
		// We expect some parsing errors in these tests.

		LogoParser.getParseTree(code, parseLogger);
		const errorsFound = parseLogger.getErrors();
		if (caseInfo.numErrors !== errorsFound.length)
			plogger(`Expected ${caseInfo.numErrors} parse error messages but got ${errorsFound.length}`);
	});
};