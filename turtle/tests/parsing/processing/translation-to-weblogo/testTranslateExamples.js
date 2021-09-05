import { exceptionToString } from
'../../../../modules/exceptionToString.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { processingExamples } from
'../../../helpers/parsing/processingExamples.js';
import { translateProcessingToWebLogo } from
'../../../../modules/parsing/processing/translation-to-weblogo/translateProcessingToWebLogo.js';

export function testTranslateExamples(logger) {
	processingExamples.forEach(function(content, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${content}`, logger);
		try {
			const result = translateProcessingToWebLogo(content);
			if (typeof result !== 'string')
				plogger(`Expected a string but got ${result}`);
		}
		catch (e) {
			console.error(e);
			plogger(`Failed to translate.  e=${exceptionToString(e)}`);
		}
	});
};