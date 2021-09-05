import { basilBasicExamples } from
'../../../../helpers/parsing/basic/basilBasicExamples.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { translateBasilBasicToWebLogo } from
'../../../../../modules/parsing/basic/basil/translation-to-weblogo/translateBasilBasicToWebLogo.js';

const examples = basilBasicExamples.slice();

export function testTranslateVariousExamples(logger) {
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		const result = translateBasilBasicToWebLogo(code);
		if (typeof result !== 'string')
			plogger(`Expected a string but found ${result}`);
	});
};