import { exceptionToString } from
'../../../../../modules/exceptionToString.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { tektronix405XExamples } from
'../../../../helpers/parsing/basic/tektronix405XExamples.js';
import { translateTektronix405XBasicToQBasic } from
'../../../../../modules/parsing/basic/tektronix-405x-basic/translation-to-weblogo/translateTektronix405XBasicToQBasic.js';

export function testTranslateVariousExamplesToQBASIC(logger) {
	tektronix405XExamples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		try {
			const result = translateTektronix405XBasicToQBasic(code);
			if (typeof result !== 'string')
				plogger(`result must be a string but found ${result}`);
		}
		catch (e) {
			plogger(`Exception thrown while translating.  e=${exceptionToString(e)}`);
		}
	});
};