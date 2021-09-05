import { exceptionToString } from
'../../../../../modules/exceptionToString.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { qbasicExamples } from
'../../../../helpers/parsing/basic/qbasicExamples.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslateVariousExamples(logger) {
	qbasicExamples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
		const translated = translateQBASICToWebLogo(code);
		if (typeof translated !== 'string')
			plogger(`Expected a string but found ${translated}`);
		}
		catch (e) {
			console.error(e);
			plogger(`Exception thrown while translating code as QBASIC to WebLogo. The exception message was ${exceptionToString(e)}`);
		}
	});
};