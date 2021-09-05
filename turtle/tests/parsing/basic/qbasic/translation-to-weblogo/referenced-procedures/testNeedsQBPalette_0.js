import { needsQBPalette_0 } from
'../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/referenced-procedures/needsQBPalette_0.js';
import { processNeedTestCases } from
'./processNeedTestCases.js';

export function testNeedsQBPalette_0(logger) {
	const cases = [
		{'in': '', 'out': false},
		{'in': 'screen 2', 'out': false},
		{'in': 'line -(0, 100)', 'out': true},
		{'in': 'palette 1, #ffffff\nline -(0, 100)', 'out': true}
	];
	processNeedTestCases(cases, needsQBPalette_0, logger);
};