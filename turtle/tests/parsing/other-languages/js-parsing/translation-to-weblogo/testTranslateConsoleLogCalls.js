import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';
import { translateToWebLogo } from
'../../../../../modules/parsing/other-languages/js-parsing/translation-to-weblogo/translateToWebLogo.js';

export function testTranslateConsoleLogCalls(logger) {
	const cases = [
		{'in': 'console.log(true);', 'out': 'print true'},
		{'in': 'console.log("hi")', 'out': 'print "hi'},
		{'in': 'console.log(\'hi\')', 'out': 'print "hi'},
		{'in': 'console.log(`hi`)', 'out': 'print "hi'},
	];
	testInOutPairs(cases, translateToWebLogo, logger);
};