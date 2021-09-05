import { LogoParser } from
'../../../../../modules/parsing/LogoParser.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateJSProcessingToWebLogo } from
'../../../../../modules/parsing/processing/js-processing/translation-to-weblogo/translateJSProcessingToWebLogo.js';
await LogoParser.asyncInit();

export function testTranslateFunctionCalls(logger) {
	const cases = [
		{'in': 'describe("hi")', 'out': ''},
		{'in': 'describe(\'hello world\')', 'out': ''},
		{'in': 'circle(1,2,3)', 'outContains': 'pCircle 1 2 3'},
		{'in': 'console.log("hi")', 'out': 'print "hi'},
		{'in': 'console.log(Math.sin(1))', 'out': 'print radSin 1'},
	];
	testInOutPairs(cases, translateJSProcessingToWebLogo, logger);
};