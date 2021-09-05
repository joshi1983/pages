import { amosBasicExamples } from
'../../../../helpers/parsing/basic/amosBasicExamples.js';
import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { exceptionToString } from
'../../../../../modules/exceptionToString.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { translateAmosBasicToWebLogo } from
'../../../../../modules/parsing/basic/amos-basic/translation-to-weblogo/translateAmosBasicToWebLogo.js';

const examples = [];
ArrayUtils.pushAll(examples, amosBasicExamples);

export function testTranslateVariousExamples(logger) {
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
			const result = translateAmosBasicToWebLogo(code);
			if (typeof result !== 'string')
				plogger(`Expected a string but found ${result}`);
		}
		catch (e) {
			console.error(e);
			plogger(`Exception thrown while translating.  e=${exceptionToString(e)}`);
		}
	});
};