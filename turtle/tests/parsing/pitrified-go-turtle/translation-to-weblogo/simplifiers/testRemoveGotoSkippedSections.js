import { processSimplifierCases } from './processSimplifierCases.js';
import { removeGotoSkippedSections } from
'../../../../../modules/parsing/pitrified-go-turtle/translation-to-weblogo/simplifiers/removeGotoSkippedSections.js';

export function testRemoveGotoSkippedSections(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'goto x\ny:\nx:\ngoto y', 'changed': false}, 
		// should not be changed because we don't want to lose a referenced label.

		{'code': 'goto x\nx:', 'to': 'x:'},
	];
	processSimplifierCases(cases, removeGotoSkippedSections, logger);
};