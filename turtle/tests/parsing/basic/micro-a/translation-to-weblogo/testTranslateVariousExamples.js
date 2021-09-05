import { microAExamples } from
'../../../../helpers/parsing/basic/microAExamples.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { translateMicroABasicToWebLogo } from
'../../../../../modules/parsing/basic/micro-a/translation-to-weblogo/translateMicroABasicToWebLogo.js';

const examples = microAExamples.slice();

export function testTranslateVariousExamples(logger) {
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		const result = translateMicroABasicToWebLogo(code);
		if (typeof result !== 'string')
			plogger(`Expected a string but found ${result}`);
	});
};