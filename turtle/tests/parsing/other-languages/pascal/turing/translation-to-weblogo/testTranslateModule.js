import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { translateTuringToWebLogo } from
'../../../../../../modules/parsing/other-languages/pascal/turing/translation-to-weblogo/translateTuringToWebLogo.js';

export function testTranslateModule(logger) {
	const cases = [
		{
			'in': `module x`, 'out': ''
		},
		{
			'in': `module x end x`, 'out': ''
		},
		{
			'in': `module x implement y`, 'out': ''
		},
		{
			'in': `module x implement y end x`, 'out': ''
		},
		{
			'in': `unit\nmodule x implement y end x`, 'out': ''
		},
	];
	testInOutPairs(cases, translateTuringToWebLogo, logger);
};