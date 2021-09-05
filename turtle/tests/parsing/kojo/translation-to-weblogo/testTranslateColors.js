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
			'in': 'setPenColor(white)',
			'outContains': 'setPenColor "white'
		},
		{
			'in': 'setFillColor(red)',
			'outContains': 'setFillColor "red'
		},
		{
			'in': 'setFillColor(green)',
			'outContains': 'setFillColor "green'
		},
		{
			'in': 'setFillColor(blue)',
			'outContains': 'setFillColor "blue'
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
		},
		{
			'in': 'setFillColor(cm.green)',
			'outContains': 'setFillColor "green'
		},
		{
			'in': 'setFillColor(cm.blue)',
			'outContains': 'setFillColor "blue'
		},
		{
			'in': 'setFillColor(cm.skyBlue)',
			'outContains': 'setFillColor "skyBlue'
		}
	];
	testInOutPairs(cases, translateKojoToWebLogo, logger);
};