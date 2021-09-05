import { bazzBasicExamples } from
'../../../../helpers/parsing/basic/bazzBasicExamples.js';
import { exceptionToString } from
'../../../../../modules/exceptionToString.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { translateBazzBasicToWebLogo } from
'../../../../../modules/parsing/basic/bazz-basic/translation-to-weblogo/translateBazzBasicToWebLogo.js';

const examples = bazzBasicExamples;

export function testTranslateVariousExamples(logger) {
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
			const result = translateBazzBasicToWebLogo(code);
			if (typeof result !== 'string')
				plogger(`Expected a string but found ${result}`);
		}
		catch (e) {
			console.error(e);
			logger(`An exception or error was thrown while translating case ${index}. e=${exceptionToString(e)}`);
		}
	});
};