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
import { translate0LToWebLogo } from
'../../../../../modules/parsing/l-systems/0L/translation-to-weblogo/translate0LToWebLogo.js';
import { zeroLExamples } from
'../../../../helpers/parsing/l-systems/zeroLExamples.js';

const examples = [];
// We'll test with more than the 0L examples
// because we want the translator to process
// invalid 0L code without throwing an error.
for (const dialectExamples of [cgjenningsExamples, fractintExamples, zeroLExamples]) {
	ArrayUtils.pushAll(examples, dialectExamples);
}

export function testTranslateVariousExamples(logger) {
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
			const result = translate0LToWebLogo(code);
			if (typeof result !== 'string')
				plogger(`Expected a string but found ${result}`);
		}
		catch (e) {
			console.error(e);
			plogger(`Exception thrown. e=${exceptionToString(e)}`);
		}
	});
};