import { exceptionToString } from
'../../../../modules/exceptionToString.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { translateTurtleGraphicsFunToWebLogo } from
'../../../../modules/parsing/turtle-graphics-fun/translation-to-weblogo/translateTurtleGraphicsFunToWebLogo.js';
import { turtleGraphicsFunExamples } from
'../../../helpers/parsing/turtleGraphicsFunExamples.js';

const examples = turtleGraphicsFunExamples.slice();

export function testTranslateVariousExamples(logger) {
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		try {
			const result = translateTurtleGraphicsFunToWebLogo(code);
			if (typeof result !== 'string')
				plogger(`Expected a string but found ${result}`);
		}
		catch (e) {
			console.error(e);
			plogger(`Error thrown while translating. e=${exceptionToString(e)}`);
		}
	});
};