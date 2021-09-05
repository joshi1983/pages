import { needsQBPalette_2 } from
'../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/referenced-procedures/needsQBPalette_2.js';
import { processNeedTestCases } from
'./processNeedTestCases.js';

export function testNeedsQBPalette_2(logger) {
	const cases = [
		{'in': '', 'out': false},
		{'in': 'screen 2', 'out': false},
		{'in': 'line -(0, 100)', 'out': false},
		{'in': 'screen 9\nline -(0, 100)', 'out': false},
		{'in': 'palette\nscreen 9\nline -(0, 100)', 'out': false},
		{'in': 'palette\nline -(0, 100)', 'out': false},
		{'in': 'palette 1, #ffffff\nline -(0, 100)', 'out': true}
	];
	processNeedTestCases(cases, needsQBPalette_2, logger);
};