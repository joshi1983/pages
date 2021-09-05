import { gotoToContinue } from
'../../../../../modules/parsing/pitrified-go-turtle/translation-to-weblogo/simplifiers/gotoToContinue.js';
import { processSimplifierCases } from './processSimplifierCases.js';

export function testGotoToContinue(logger) {
	const cases = [
		{'code': '', 'changed': false},	
		{'code': 'someLabel:\ngoto someLabel', 'changed': false},
		{'code': 'for {\ngoto someLabel\nsomeLabel:\n}', 'to': 'for {\ncontinue\nsomeLabel:\n}'},
	];
	processSimplifierCases(cases, gotoToContinue, logger);
};