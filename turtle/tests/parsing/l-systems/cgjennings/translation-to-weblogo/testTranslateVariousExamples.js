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
import { translateCGJenningsToWebLogo } from
'../../../../../modules/parsing/l-systems/cgjennings/translation-to-weblogo/translateCGJenningsToWebLogo.js';
import { zeroLExamples } from
'../../../../helpers/parsing/l-systems/zeroLExamples.js';

const examples = [];
for (const part of [cgjenningsExamples, fractintExamples, zeroLExamples]) {
	ArrayUtils.pushAll(examples, part);
}

export function testTranslateVariousExamples(logger) {
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
			const webLogoCode = translateCGJenningsToWebLogo(code);
			if (typeof webLogoCode !== 'string')
				plogger(`Expected a string but found ${webLogoCode}`);
		}
		catch (e) {
			console.error(e);
			plogger(`Exception thrown. e=${exceptionToString(e)}`);
		}
	});
};