import { badExamples } from
'./badExamples.js';
import { exceptionToString } from
'../../../../../../modules/exceptionToString.js';
import { germanLogoExamples } from
'../../../../../helpers/parsing/germanLogoExamples.js';
import { germanLogoToWebLogo } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/german-logo/germanLogoToWebLogo.js';
import { ParseLogger } from
'../../../../../../modules/parsing/loggers/ParseLogger.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testGermanLogoToWebLogoWithVariousExamples(logger) {
	const cases = germanLogoExamples.concat(badExamples);
	cases.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
			const parseLogger = new ParseLogger();
			const result = germanLogoToWebLogo(code, parseLogger);
			if (typeof result !== 'string') {
				plogger(`Expected result to be a string but found ${result}`);
			}
		}
		catch (e) {
			console.error(e);
			plogger(`Caught an error. e=${exceptionToString(e)}`);
		}
	});
};