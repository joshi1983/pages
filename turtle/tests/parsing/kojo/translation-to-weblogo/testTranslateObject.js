import { translateKojoToWebLogo } from
'../../../../modules/parsing/kojo/translation-to-weblogo/translateKojoToWebLogo.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testTranslateObject(logger) {
	const cases = [
		{
			'in': 'object', 'out': ''
		},
		{
			'in': 'object A', 'out': ''
		},
		{
			'in': 'object A {}', 'out': ''
		},
		{
			'in': `object A {}
println("hi")`,
			'out': 'print "hi'
		}

	];
	testInOutPairs(cases, translateKojoToWebLogo, logger);
};