import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { translateHTBasicToWebLogo } from
'../../../../../../modules/parsing/other-languages/basic/htbasic/translation-to-weblogo/translateHTBasicToWebLogo.js';

export function testTranslateRemove(logger) {
	const cases = [
		{'in': 'wait 1', 'out': ''},
		{'in': 'pause', 'out': ''},
		{'in': 'ginit', 'out': ''}
	];
	testInOutPairs(cases, translateHTBasicToWebLogo, logger);
};