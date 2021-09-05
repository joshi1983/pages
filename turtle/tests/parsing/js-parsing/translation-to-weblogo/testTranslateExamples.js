import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { translateToWebLogo } from
'../../../../modules/parsing/js-parsing/translation-to-weblogo/translateToWebLogo.js';

// FIXME: get a list of JavaScript content to test with.
// The codeHeartTurtleScript examples might be worth including.
// The canvas-2d examples may also be worth including.
const examples = [];

export function testTranslateExamples(logger) {
	examples.forEach(function(content, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${content}`, logger);
		const result = translateToWebLogo(content);
		if (typeof result !== 'string')
			plogger(`Expected a string result but got ${result}`);
	});
};