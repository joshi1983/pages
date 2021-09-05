import { isLikelyLogoInterpreter } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/logo-interpreter/isLikelyLogoInterpreter.js';
import { logoInterpreterExamples } from
'../../../../../helpers/parsing/logoInterpreterExamples.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { webLogoExamplesContent } from
'../../../../../helpers/parsing/webLogoExamplesContent.js';

export function testIsLikelyLogoInterpreter(logger) {
	const cases = logoInterpreterExamples.map(function(content) {
		return {
			'in': content,
			'out': true
		};
	});
	cases.push({
		'in': `ht
window
setbgcolor "#000000
setcolor "#FF0000`,
		'out': true
	});
	webLogoExamplesContent.forEach(function(webLogoContent) {
		cases.push({
			'in': webLogoContent,
			'out': false
		});
	});
	testInOutPairs(cases, isLikelyLogoInterpreter, logger);
};