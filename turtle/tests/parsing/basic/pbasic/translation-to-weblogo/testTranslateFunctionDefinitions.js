import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translatePBasicToWebLogo } from
'../../../../../modules/parsing/basic/pbasic/translation-to-weblogo/translatePBasicToWebLogo.js';

export function testTranslateFunctionDefinitions(logger) {
	const cases = [
		{'in': 'func f() {}', 'out': 'to f\nend'},
		{'in': 'func f() {print "hi"}', 'out': 'to f\n\tprint "hi\nend'},
		{'in': 'func f() {print "hi" print "hello" }', 'out': 'to f\n\tprint "hi\n\tprint "hello\nend'},
		{'in': 'func f(param1) {}', 'out': 'to f :param1\nend'},
		{'in': 'func f(param1, param2) {}', 'out': 'to f :param1 :param2\nend'},
		{'in': 'func p() {}', 'out': 'to p\nend'},
	];
	testInOutPairs(cases, translatePBasicToWebLogo, logger);
};