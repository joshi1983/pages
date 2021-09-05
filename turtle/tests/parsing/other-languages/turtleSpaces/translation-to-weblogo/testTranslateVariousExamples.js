import { exceptionToString } from
'../../../../../modules/exceptionToString.js';
import { turtleSpacesExamples } from
'../../../../helpers/parsing/turtleSpacesExamples.js';
import { translateTurtleSpacesToWebLogo } from
'../../../../../modules/parsing/other-languages/turtleSpaces/translation-to-weblogo/translateTurtleSpacesToWebLogo.js';

// translate various examples 
// mostly to make sure
// no exceptions are thrown.
export function testTranslateVariousExamples(logger) {
	turtleSpacesExamples.forEach(function(example, index) {
		try {
			const result = translateTurtleSpacesToWebLogo(example);
			if (typeof result !== 'string')
				logger(`Expected a string but found ${result}`);
		}
		catch (e) {
			console.error(e);
			logger(`Exception thrown while translating example ${index}. e=${exceptionToString(e)}.  The example has code: ${example}.`);
		}
	});
};