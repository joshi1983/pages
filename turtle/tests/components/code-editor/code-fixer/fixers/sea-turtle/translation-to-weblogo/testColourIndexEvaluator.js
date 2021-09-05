import { colourIndexEvaluator } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/sea-turtle/translation-to-weblogo/colourIndexEvaluator.js';
import { processTestCases } from '../../processTestCases.js';

export function testColourIndexEvaluator(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'setScreenColor "blue', 'logged': false},
		{'code': 'setScreenColor 0+1',
		'to': 'setScreenColor "blue', 'logged': true},
		{'code': 'setScreenColor 0*1',
		'to': 'setScreenColor "black', 'logged': true},
	];
	processTestCases(cases, colourIndexEvaluator, logger);
};