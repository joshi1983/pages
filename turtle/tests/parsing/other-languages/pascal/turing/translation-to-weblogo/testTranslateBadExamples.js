import { badExamples } from
'../badExamples.js';
import { exceptionToString } from
'../../../../../../modules/exceptionToString.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';
import { translateTuringToWebLogo } from
'../../../../../../modules/parsing/other-languages/pascal/turing/translation-to-weblogo/translateTuringToWebLogo.js';

/*
We don't want any errors thrown while translating code even if the code is not valid Turing code.
The translated WebLogo code should have comments indicating the failures to translate but no Error or exception should be thrown.
*/
export function testTranslateBadExamples(logger) {
	badExamples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
			const translated = translateTuringToWebLogo(code);
			if (typeof translated !== 'string')
				plogger(`Expected a string from translateTuringToWebLogo but found ${translated}`);
		}
		catch (e) {
			console.error(e);
			plogger(`Error thrown ${exceptionToString(e)}`);
		}
	});
};