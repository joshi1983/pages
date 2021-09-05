import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateSinclairBasicToWebLogo } from
'../../../../../modules/parsing/basic/sinclair-basic/translation-to-weblogo/translateSinclairBasicToWebLogo.js';

export function testTranslateSinclairBasicToWebLogo(logger) {
	const cases = [
		{'in': 'CLS', 'out': 'clearScreen'},
		{'in': 'print PI', 'out': 'print pi'},
		{'in': 'border 1', 'out': ''}
	];
	testInOutPairs(cases, translateSinclairBasicToWebLogo, logger);
};