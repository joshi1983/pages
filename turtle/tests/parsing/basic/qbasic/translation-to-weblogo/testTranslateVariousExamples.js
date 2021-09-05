import { exceptionToString } from
'../../../../../modules/exceptionToString.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { qbasicExamples } from
'../../../../helpers/parsing/basic/qbasicExamples.js';
import { translate } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translate.js';

export function testTranslateVariousExamples(logger) {
	qbasicExamples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
		const translated = translate(code);
		if (typeof translated !== 'string')
			plogger(`Expected a string but found ${translated}`);
		}
		catch (e) {
			console.error(e);
			plogger(`Exception thrown while translating code as QBASIC to WebLogo. The exception message was ${exceptionToString(e)}`);
		}
	});
};