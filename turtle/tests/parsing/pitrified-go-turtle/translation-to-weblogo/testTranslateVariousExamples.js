import { exceptionToString } from
'../../../../modules/exceptionToString.js';
import { pitrifiedGoTurtleExamples } from
'../../../helpers/parsing/pitrifiedGoTurtleExamples.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { translatePitrifiedGoTurtleToWebLogo } from
'../../../../modules/parsing/pitrified-go-turtle/translation-to-weblogo/translatePitrifiedGoTurtleToWebLogo.js';

export function testTranslateVariousExamples(logger) {
	const examples = pitrifiedGoTurtleExamples;
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		try {
			const result = translatePitrifiedGoTurtleToWebLogo(code);
			if (typeof result !== 'string')
				plogger(`Expected a string but found ${result}`);
		}
		catch (e) {
			console.error(e);
			plogger(`Error thrown while translating. e=${exceptionToString(e)}`);
		}
	});
};