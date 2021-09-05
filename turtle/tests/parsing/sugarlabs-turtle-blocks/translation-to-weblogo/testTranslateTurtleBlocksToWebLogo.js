import { exceptionToString } from
'../../../../modules/exceptionToString.js';
import { sugarLabsTurtleBlocksExamples } from
'../../../helpers/parsing/sugarLabsTurtleBlocksExamples.js';
import { sugarLabsTurtleBlocksHTMLExamples } from
'../../../helpers/parsing/sugarLabsTurtleBlocksHTMLExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translateTurtleBlocksToWebLogo } from
'../../../../modules/parsing/sugarlabs-turtle-blocks/translation-to-weblogo/translateTurtleBlocksToWebLogo.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

const examples = sugarLabsTurtleBlocksExamples.concat(sugarLabsTurtleBlocksHTMLExamples);

function testSpecialCases(logger) {
	const cases = [
	];
	testInOutPairs(cases, translateTurtleBlocksToWebLogo, logger);
}

function testAllExamplesDoNotThrowError(logger) {
	for (const code of examples) {
		try {
			const result = translateTurtleBlocksToWebLogo(code);
			if (typeof result !== 'string')
				logger(`Expected result to be a string but found ${result}`);
		}
		catch (e) {
			console.error(e);
			logger(`Error with message (${exceptionToString(e)}) thrown while translating ${code}`);
		}
	}
}

export function testTranslateTurtleBlocksToWebLogo(logger) {
	wrapAndCall([
		testAllExamplesDoNotThrowError,
		testSpecialCases,
	], logger);
};