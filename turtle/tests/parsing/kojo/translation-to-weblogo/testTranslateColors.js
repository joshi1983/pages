import { translateKojoToWebLogo } from
'../../../../modules/parsing/kojo/translation-to-weblogo/translateKojoToWebLogo.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testTranslateColors(logger) {
	const cases = [
		{
			'in': 'setPenColor(black)',
			'outContains': 'setPenColor "black'
		},
		{
			'in': 'setFillColor(red)',
			'outContains': 'setFillColor "red'
		},
		{
			'in': 'setFillColor(noColor)',
			'outContains': 'setFillColor transparent'
		},
		{
			'in': 'stroke(yellow)',
			'outContains': 'setPenColor "yellow'
		},
		{
			'in': 'setFillColor(ColorMaker.red)',
			'outContains': 'setFillColor "red'
		},
		{
			'in': 'setFillColor(cm.red)',
			'outContains': 'setFillColor "red'
		}
	];
	testInOutPairs(cases, translateKojoToWebLogo, logger);
};