import { exceptionToString } from
'../../../../../../modules/exceptionToString.js';
import { libertyBasicExamples } from
'../../../../../helpers/parsing/basic/libertyBasicExamples.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';
import { translateLibertyBasicToWebLogo } from
'../../../../../../modules/parsing/other-languages/basic/liberty-basic/translation-to-weblogo/translateLibertyBasicToWebLogo.js';

const examples = libertyBasicExamples;

export function testTranslateVariousExamples(logger) {
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
			const result = translateLibertyBasicToWebLogo(code);
			if (typeof result !== 'string')
				plogger(`Expected a string but found ${result}`);
		}
		catch (e) {
			console.error(e);
			logger(`An exception or error was thrown while translating case ${index}. e=${exceptionToString(e)}`);
		}
	});
};