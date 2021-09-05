import { basicFusionExamples } from
'../../../../helpers/parsing/basic/basicFusionExamples.js';
import { exceptionToString } from
'../../../../../modules/exceptionToString.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { translateBasicFusionToWebLogo } from
'../../../../../modules/parsing/basic/basic-fusion/translation-to-weblogo/translateBasicFusionToWebLogo.js';

const examples = basicFusionExamples;

export function testTranslateVariousExamples(logger) {
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
			const result = translateBasicFusionToWebLogo(code);
			if (typeof result !== 'string')
				plogger(`Expected a string but found ${result}`);
		}
		catch (e) {
			console.error(e);
			logger(`An exception or error was thrown while translating case ${index}. e=${exceptionToString(e)}`);
		}
	});
};