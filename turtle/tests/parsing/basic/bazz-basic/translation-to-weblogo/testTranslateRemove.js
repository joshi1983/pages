import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateBazzBasicToWebLogo } from
'../../../../../modules/parsing/basic/bazz-basic/translation-to-weblogo/translateBazzBasicToWebLogo.js';

export function testTranslateRemove(logger) {
	const cases = [
		{'in': 'SLEEP 5000', 'out': ''},
		{'in': 'SCREENLOCK ON', 'out': ''},
		{'in': 'SCREENLOCK OFF', 'out': ''}
	];
	testInOutPairs(cases, translateBazzBasicToWebLogo, logger);
};