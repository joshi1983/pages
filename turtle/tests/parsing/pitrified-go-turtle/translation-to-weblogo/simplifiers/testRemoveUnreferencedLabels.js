import { processSimplifierCases } from './processSimplifierCases.js';
import { removeUnreferencedLabels } from
'../../../../../modules/parsing/pitrified-go-turtle/translation-to-weblogo/simplifiers/removeUnreferencedLabels.js';

export function testRemoveUnreferencedLabels(logger) {
	const cases = [
		{'code': '', 'changed': false},	
		{'code': 'someLabel:\ngoto someLabel', 'changed': false},
		{'code': 'someLabel:', 'to': ''},
	];
	processSimplifierCases(cases, removeUnreferencedLabels, logger);
};