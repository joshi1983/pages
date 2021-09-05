import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateBasilBasicToWebLogo } from
'../../../../../modules/parsing/basic/basil/translation-to-weblogo/translateBasilBasicToWebLogo.js';

export function testTranslateFunctionCalls(logger) {
	const cases = [
		{'in': 'println "hi"', 'out': 'print "hi"'}
	];
	testInOutPairs(cases, translateBasilBasicToWebLogo, logger);
};