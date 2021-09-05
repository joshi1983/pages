import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslatePalette(logger) {
	const cases = [
		{
		'in': 'screen 9\nline -(40,40)\npalette\nline -(100,100)',
		'outContains': 'qbPalette_0'},
		{
		'in': 'screen 9\nline -(40,40)\npalette 1, 8\nline -(100,100)',
		'outContains': 'qbPalette_2'},
		{
		'in': 'screen 9\nline -(40,40)\npalette 1, 8\nline -(100,100)',
		'outContains': 'qbPalette_0'}
	];
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};