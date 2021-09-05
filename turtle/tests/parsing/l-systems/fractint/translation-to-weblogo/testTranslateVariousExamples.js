import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { cgjenningsExamples } from
'../../../../helpers/parsing/l-systems/cgjenningsExamples.js';
import { exceptionToString } from
'../../../../../modules/exceptionToString.js';
import { fractintExamples } from
'../../../../helpers/parsing/l-systems/fractintExamples.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { translateFractIntToWebLogo } from
'../../../../../modules/parsing/l-systems/fractint/translation-to-weblogo/translateFractIntToWebLogo.js';
import { zeroLExamples } from
'../../../../helpers/parsing/l-systems/zeroLExamples.js';

// If WebLogo's classifier fails, we could end up translating invalid fractint code.
// We don't want the translater throwing errors or exceptions just because the code is not from the fractint language.
// This is why we're testing with some examples that are not fractint.
const examples = [];
for (const part of [cgjenningsExamples, fractintExamples, zeroLExamples]) {
	ArrayUtils.pushAll(examples, part);
}

export function testTranslateVariousExamples(logger) {
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
			const webLogoCode = translateFractIntToWebLogo(code);
			if (typeof webLogoCode !== 'string')
				plogger(`Expected a string but found ${webLogoCode}`);
		}
		catch (e) {
			console.error(e);
			plogger(`Exception thrown. e=${exceptionToString(e)}`);
		}
	});
};