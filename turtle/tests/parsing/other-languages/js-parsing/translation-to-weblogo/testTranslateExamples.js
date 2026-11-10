import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { translateToWebLogo_ } from
'./translateToWebLogo_.js';

// FIXME: get a list of JavaScript content to test with.
// The codeHeartTurtleScript examples might be worth including.
// The canvas-2d examples may also be worth including.
const examples = [];

export function testTranslateExamples(logger) {
	examples.forEach(function(content, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${content}`, logger);
		const result = translateToWebLogo_(content);
		if (typeof result !== 'string')
			plogger(`Expected a string result but got ${result}`);
	});
};