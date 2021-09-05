import { bbcBasicExamples } from
'../../helpers/parsing/bbcBasicExamples.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';
import { translateBBCBasicToWebLogo } from
'../../../modules/parsing/bbc-basic/translateBBCBasicToWebLogo.js';
import { wrapAndCall } from
'../../helpers/wrapAndCall.js';

function translateVariousExamples(logger) {
	bbcBasicExamples.forEach(function(bbcCode, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${bbcCode}`, logger);
		const result = translateBBCBasicToWebLogo(bbcCode);
		if (typeof result !== 'string')
			plogger(`Expected a string but found ${result}`);
	});
}

function translateWithExpectedSpecificOutputs(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'print "hi"', 'out': 'print "hi'},
		{'in': 'mode 5', 'out': ''},
		{'in': 'REM comment', 'out': '; comment'},
		{'in': 'REM comment1\nREM comment2', 'out': '; comment1 \n; comment2'}
	];
	testInOutPairs(cases, translateBBCBasicToWebLogo, logger);
}

export function testTranslateBBCBasicToWebLogo(logger) {
	wrapAndCall([
		translateWithExpectedSpecificOutputs,
		translateVariousExamples
	], logger);
};