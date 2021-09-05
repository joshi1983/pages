import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { badExamples } from
'../badExamples.js';
import { exceptionToString } from
'../../../../../modules/exceptionToString.js';
import { jossExamples } from
'../../../../helpers/parsing/jossExamples.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { translateJossToWebLogo } from
'../../../../../modules/parsing/other-languages/joss/translation-to-weblogo/translateJossToWebLogo.js';

export function testTranslateVariousExamples(logger) {
	const examples = jossExamples.slice();
	ArrayUtils.pushAll(examples, badExamples);
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		try {
			const result = translateJossToWebLogo(code);
			if (typeof result !== 'string')
				plogger(`Expected a string but found ${result}`);
		}
		catch (e) {
			console.error(e);
			plogger(`Error thrown while translating. e=${exceptionToString(e)}`);
		}
	});
};