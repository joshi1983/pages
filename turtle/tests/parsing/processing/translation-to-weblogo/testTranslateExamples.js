import { exceptionToString } from
'../../../../modules/exceptionToString.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { processingExamples } from
'../../../helpers/parsing/processingExamples.js';
import { translate } from
'../../../../modules/parsing/processing/translation-to-weblogo/translate.js';

export function testTranslateExamples(logger) {
	processingExamples.forEach(function(content, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${content}`, logger);
		try {
			const result = translate(content);
			if (typeof result !== 'string')
				plogger(`Expected a string but got ${result}`);
		}
		catch (e) {
			console.error(e);
			plogger(`Failed to translate.  e=${exceptionToString(e)}`);
		}
	});
};