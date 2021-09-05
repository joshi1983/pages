import { translateKojoToWebLogo } from
'../../../../modules/parsing/kojo/translation-to-weblogo/translateKojoToWebLogo.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testTranslateFuncCalls(logger) {
	const cases = [
		{
			'in': 'right(123)',
			'outContains': 'right 123'
		},
		{
			'in': 'right(123, radius)',
			'outContains': 'arcRight 123 :radius'
		},
		{
			'in': 'println(randomBoolean)',
			'outContains': 'print kojoRandomBoolean'
		},
		{
			'in': 'println(random(10, 20))',
			'outContains': 'print kojoRandom_2 10 20'
		},
		{
			'in': 'println(randomDouble(10))',
			'outContains': 'print kojoRandomDouble_1 10'
		},
		{
			'in': 'println(randomDouble(10, 20))',
			'outContains': 'kojoRandomDouble_2 10 20'
		},
		{
			'in': 'zoom(1.2)',
			'out': ''
		},
		{
			'in': 'val clr = cm.radialGradient(0, 0, red, cb.height / 2, yellow, true)',
			'outContains': 'kojoRadialGradient 0 0 "red '
		},
		{
			'in': 'setPenFont(someFont)',
			'outContains': 'kojoSetPenFont :someFont'
		},
		{
			'in': 'savePosHe()',
			'outContains': '\nkojoSavePosHe'
		},
		{
			'in': 'restorePosHe()',
			'outContains': '\nkojoRestorePosHe'
		},
		{
			'in': 'jumpTo(-80, -50)',
			'outContains': 'jumpTo [ -80 -50 ]'
		},
		{
			'in': 'ellipse(50, 20)',
			'outContains': 'kojoEllipse 50 20'
		}
	];
	testInOutPairs(cases, translateKojoToWebLogo, logger);
};