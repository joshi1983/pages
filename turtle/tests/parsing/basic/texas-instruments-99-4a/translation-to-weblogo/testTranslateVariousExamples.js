import { applesoftExamples } from
'../../../../helpers/parsing/basic/applesoftExamples.js';
import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { bbcBasicExamples } from
'../../../../helpers/parsing/basic/bbcBasicExamples.js';
import { exceptionToString } from
'../../../../../modules/exceptionToString.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { texasInstruments99_4aExamples } from
'../../../../helpers/parsing/basic/texasInstruments99_4aExamples.js';
import { translateTI99BasicToWebLogo } from
'../../../../../modules/parsing/basic/texas-instruments-99-4a/translation-to-weblogo/translateTI99BasicToWebLogo.js';

const examples = texasInstruments99_4aExamples.slice();

// Test with some other Basic dialects because translation should
// throw an exception even if the input code isn't valid TI99 code.
ArrayUtils.pushAll(examples, applesoftExamples);
ArrayUtils.pushAll(examples, bbcBasicExamples);

export function testTranslateVariousExamples(logger) {
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		try {
			const result = translateTI99BasicToWebLogo(code);
			if (typeof result !== 'string')
				plogger(`result must be a string but found ${result}`);
		}
		catch (e) {
			plogger(`Exception thrown while translating.  e=${exceptionToString(e)}`);
		}
	});
};