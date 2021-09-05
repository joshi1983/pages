import { pBasicExamples } from
'../../../../helpers/parsing/basic/pBasicExamples.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { translatePBasicToWebLogo } from
'../../../../../modules/parsing/basic/pbasic/translation-to-weblogo/translatePBasicToWebLogo.js';

const examples = pBasicExamples.slice();

export function testTranslateVariousExamples(logger) {
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		const result = translatePBasicToWebLogo(code);
		if (typeof result !== 'string')
			plogger(`Expected a string but found ${result}`);
	});
};