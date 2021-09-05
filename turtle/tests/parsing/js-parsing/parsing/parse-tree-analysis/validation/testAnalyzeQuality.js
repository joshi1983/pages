import { analyzeQuality } from
'../../../../../../modules/parsing/js-parsing/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { BufferedParseLogger } from
'../../../../../../modules/parsing/loggers/BufferedParseLogger.js';
import { MessageTypes } from
'../../../../../../modules/components/MessageTypes.js';
import { noop } from
'../../../../../../modules/noop.js';
import { parse } from
'../../../../../../modules/parsing/js-parsing/parse.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testAnalyzeQuality(logger) {
	const cases = [
	{'code': '', 'error': false},
	{'code': 'console.log({"x": 4}.x); // should print 4', 'error': false},
	{'code': 'console.log({"x": 4, "x": 10}.x);', 'warn': true}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const parseLogger = new BufferedParseLogger(noop);
		analyzeQuality(parseResult.root, parseLogger);
		if (caseInfo.error !== true && parseLogger.hasLoggedErrors())
			plogger(`No error expected but found some.  Error messages are: ${parseLogger.getMessages().filter(m => m.type === MessageTypes.TypeError).map(m => m.msg).join(',')}`);
		const warnings = parseLogger.getMessages().filter(m => MessageTypes.TypeWarning);
		if (caseInfo.warn !== true && warnings.length !== 0)
			plogger(`No warning expected but found some.  Warning messages are: ${warnings.map(m => m.msg).join(',')}`);
	});
};