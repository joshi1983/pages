import { needsGlobalScreenVariable } from
'../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/referenced-procedures/needsGlobalScreenVariable.js';
import { processNeedTestCases } from
'./processNeedTestCases.js';

export function testNeedsGlobalScreenVariable(logger) {
	const cases = [
		{'in': '', 'out': false},
		{'in': 'screen 2', 'out': false},
		{'in': 'line -(0, 100)', 'out': true},
		
		{'in': 'print "hi"', 'out': false},
		{'in': 'screen 4', 'out': false},
		{'in': 'circle (10, 20), 3', 'out': true},
		{'in': 'pset (10, 20), 3', 'out': true},
		{'in': 'preset (10, 20), 3', 'out': true},
		{'in': 'draw "C3 U10"', 'out': true}
	];
	processNeedTestCases(cases, needsGlobalScreenVariable, logger);
};