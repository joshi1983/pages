import { translateKojoToWebLogo } from
'../../../../modules/parsing/kojo/translation-to-weblogo/translateKojoToWebLogo.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testTranslateToPolyStart(logger) {
	const cases = [
		{
			'in': 'repeat(4) {forward(10);right(90)}',
			'outContains': 'polyStart'
		}
	];
	testInOutPairs(cases, translateKojoToWebLogo, logger);
};