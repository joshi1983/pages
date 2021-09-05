import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { badExamples } from
'../badExamples.js';
import { exceptionToString } from
'../../../../modules/exceptionToString.js';
import { kojoExamples } from
'../../../helpers/parsing/kojoExamples.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { translateKojoToWebLogo } from
'../../../../modules/parsing/kojo/translation-to-weblogo/translateKojoToWebLogo.js';

export function testTranslateVariousExamples(logger) {
	const examples = kojoExamples.slice();
	ArrayUtils.pushAll(examples, badExamples);
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		try {
			const result = translateKojoToWebLogo(code);
			if (typeof result !== 'string')
				plogger(`Expected a string but found ${result}`);
		}
		catch (e) {
			console.error(e);
			plogger(`Error thrown while translating. e=${exceptionToString(e)}`);
		}
	});
};