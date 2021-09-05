import { processSimplifierCases } from './processSimplifierCases.js';
import { renameClashingDefNames } from
'../../../../../modules/parsing/kojo/translation-to-weblogo/simplifiers/renameClashingDefNames.js';

export function testRenameClashingDefNames(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'circle(100)', 'changed': false},
		{'code': 'penUp', 'changed': false},
		{'code': 'def p {\n}', 'changed': false},
		{'code': 'def Circle {\n}', 'to': 'def Circle0 {\n}'},
		{'code': 'def Circle() {\n}\nCircle()', 'to': 'def Circle0() {\n}\nCircle0()'},
	];
	processSimplifierCases(cases, renameClashingDefNames, logger);
};