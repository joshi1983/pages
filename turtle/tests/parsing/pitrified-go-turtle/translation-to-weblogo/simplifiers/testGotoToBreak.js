import { gotoToBreak } from
'../../../../../modules/parsing/pitrified-go-turtle/translation-to-weblogo/simplifiers/gotoToBreak.js';
import { processSimplifierCases } from './processSimplifierCases.js';

export function testGotoToBreak(logger) {
	const cases = [
		{'code': '', 'changed': false},	
		{'code': 'someLabel:\ngoto someLabel', 'changed': false},
		{'code': 'for {\ngoto someLabel\n}\nsomeLabel:', 'to': 'for {\nbreak\n}\nsomeLabel:'},
	];
	processSimplifierCases(cases, gotoToBreak, logger);
};