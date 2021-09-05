import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateSinclairBasicToWebLogo } from
'../../../../../modules/parsing/basic/sinclair-basic/translation-to-weblogo/translateSinclairBasicToWebLogo.js';

export function testTranslateSinclairBasicToWebLogo(logger) {
	const cases = [
	{'in': 'CLS', 'out': 'clearScreen'}
	];
	testInOutPairs(cases, translateSinclairBasicToWebLogo, logger);
};