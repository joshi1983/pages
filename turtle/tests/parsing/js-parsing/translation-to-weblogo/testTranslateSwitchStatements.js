import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translateToWebLogo } from
'../../../../modules/parsing/js-parsing/translation-to-weblogo/translateToWebLogo.js';

export function testTranslateSwitchStatements(logger) {
	const cases = [
		{'in': 'switch (1) {}', 'out': ''},
		{'in': `switch (undefined) {
  default:
	console.log(2)
}`, 'out': 'print 2'},
		{'in': `switch (1) {
  case 1:
	console.log(2)
}`, 'out': 'if 1 = 1 [\n\tprint 2\n]'},
		{'in': `switch (x) {
  case 1:
	console.log(3)
}`, 'out': 'if 1 = :x [\n\tprint 3\n]'}
	];
	testInOutPairs(cases, translateToWebLogo, logger);
};