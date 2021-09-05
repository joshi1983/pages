import { processTestCases } from './processTestCases.js';
import { useStrFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/useStrFixer.js';

export function testUseStrFixer(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'setLineCap round\nfd 100', 'logged': false},
		{'code': 'make "largeRadius * 0.02', 'logged': false, 'ignoreParseErrors': true},
		{'code': 'to p\nlocalmake "largeRadius * 0.02\nend', 'logged': false, 'ignoreParseErrors': true},
		{'code': 'label 5', 'logged': false}, // let the quoteNumberFixer and quoteIntegerFixer handle number literals.
		{'code': 'label 4+random 4', 'to': 'label str 4+random 4', 'logged': true},
		{'code': 'repeat 2[label repcount]', 'to': 'repeat 2[label str repcount]', 'logged': true},
	];
	processTestCases(cases, useStrFixer, logger);
};