import { exceptionToString } from
'../../../../modules/exceptionToString.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { translateTurtleToyNetToWebLogo } from
'../../../../modules/parsing/turtletoy-net/translation-to-weblogo/translateTurtleToyNetToWebLogo.js';
import { turtleToyNetExamples } from
'../../../helpers/parsing/turtleToyNetExamples.js';

const examples = turtleToyNetExamples.slice();

export function testTranslateVariousExamples(logger) {
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		try {
			const result = translateTurtleToyNetToWebLogo(code);
			if (typeof result !== 'string')
				plogger(`Expected a string but found ${result}`);
		}
		catch (e) {
			console.error(e);
			plogger(`Error thrown while translating. e=${exceptionToString(e)}`);
		}
	});
};