import { exceptionToString } from
'../../../../../../modules/exceptionToString.js';
import { htBasicExamples } from
'../../../../../helpers/parsing/basic/htBasicExamples.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';
import { translateHTBasicToWebLogo } from
'../../../../../../modules/parsing/other-languages/basic/htbasic/translation-to-weblogo/translateHTBasicToWebLogo.js';

const examples = htBasicExamples;

export function testTranslateVariousExamples(logger) {
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
			const result = translateHTBasicToWebLogo(code);
			if (typeof result !== 'string')
				plogger(`Expected a string but found ${result}`);
		}
		catch (e) {
			console.error(e);
			logger(`An exception or error was thrown while translating case ${index}. e=${exceptionToString(e)}`);
		}
	});
};