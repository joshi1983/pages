import { exceptionToString } from
'../../../../../modules/exceptionToString.js';
import { javascriptProcessingExamples } from
'../../../../helpers/parsing/javascriptProcessingExamples.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { translateJSProcessingToWebLogo } from
'../../../../../modules/parsing/processing/js-processing/translation-to-weblogo/translateJSProcessingToWebLogo.js';

export function testTranslateVariousExamples(logger) {
	javascriptProcessingExamples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		try {
			const result = translateJSProcessingToWebLogo(code);
			if (typeof result !== 'string')
				plogger(`Expected a string but found ${result}`);
		}
		catch (e) {
			plogger(`Failed to translate. code=${code}, e=${exceptionToString(e)}`);
		}
	});
};