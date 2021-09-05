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
		},
		{
			'code': 'print [backward]',
			'numErrors': 1
		},
		{
			'code': 'print [setXY 2]',
			'numErrors': 1
		},
		{
			'code': 'print [setXY 1 2]',
			'numErrors': 0
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
		
		if (caseInfo.numErrors !== 0) {
			const parseLogger2 = new TestParseLogger(plogger, code, true);
			LogoParser.getParseTree(code, parseLogger2, undefined, {
				'isSplittingNumberPrefixes': true,
				'supressGroupingErrors': true
			});
			const messages = parseLogger2.getErrors();
			if (messages.length !== 0)
				plogger(`No parameterized group error messages expected when supressGroupingErrors ` +
					`is true but found ${messages.length}. messages = ${messages.map(m => m.msg).join(', ')}`);
		}
	});
};