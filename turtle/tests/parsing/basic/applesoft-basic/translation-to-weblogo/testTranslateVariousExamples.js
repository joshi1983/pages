import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { applesoftExamples } from
'../../../../helpers/parsing/basic/applesoftExamples.js';
import { bbcBasicExamples } from
'../../../../helpers/parsing/basic/bbcBasicExamples.js';
import { exceptionToString } from
'../../../../../modules/exceptionToString.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { qbasicExamples } from
'../../../../helpers/parsing/basic/qbasicExamples.js';
import { smallVisualBasicExamples } from
'../../../../helpers/parsing/basic/smallVisualBasicExamples.js';
import { tektronix405XExamples } from
'../../../../helpers/parsing/basic/tektronix405XExamples.js';
import { translateAppleSoftBasicToWebLogo } from
'../../../../../modules/parsing/basic/applesoft-basic/translation-to-weblogo/translateAppleSoftBasicToWebLogo.js';

/*
The applesoftExamples is the most similar to the kind of code that will 
be passed to the translator in average use of the software.

The other examples are translated to test that the translation still returns a string
even when the code isn't valid AppleSoft BASIC.
Invalid AppleSoft BASIC could be passed to the translator if the isLikelyAppleSoftBASIC returns true incorrectly.
*/
const examples = applesoftExamples.slice();
ArrayUtils.pushAll(examples, bbcBasicExamples);
ArrayUtils.pushAll(examples, qbasicExamples);
ArrayUtils.pushAll(examples, smallVisualBasicExamples);
ArrayUtils.pushAll(examples, tektronix405XExamples);

export function testTranslateVariousExamples(logger) {
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
		const translated = translateAppleSoftBasicToWebLogo(code);
		if (typeof translated !== 'string')
			plogger(`Expected a string but found ${translated}`);
		}
		catch (e) {
			console.error(e);
			plogger(`Exception thrown while translating code as AppleSoft BASIC to WebLogo. The exception message was ${exceptionToString(e)}`);
		}
	});
};