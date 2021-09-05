import { translateKojoToWebLogo } from
'../../../../modules/parsing/kojo/translation-to-weblogo/translateKojoToWebLogo.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testTranslateEventHandlers(logger) {
	const cases = [
		{
			'in': 'animate {}',
			'outContains': 'to animate\nend'
		},
		{
			'in': 'setup {}',
			'outContains': 'to setup\nend'
		},
	];
	testInOutPairs(cases, translateKojoToWebLogo, logger);
};