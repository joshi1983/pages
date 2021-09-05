import { processTestCases } from './processTestCases.js';
import { validateDuplicateDeclarations } from
'../../../../../../../modules/parsing/js-parsing/parsing/parse-tree-analysis/validation/validating-modules/validateDuplicateDeclarations.js';

export function testValidateDuplicateDeclarations(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'function x() {}', 'error': false},
		{'code': 'const x = 0;', 'error': false},
		{'code': 'let x = 0;', 'error': false},
		{'code': 'let x = 0;\nfor (let x=2; x<10;x++) {}', 'error': false},
		// The declared variables in a for-loop are in a different scope so it isn't a problem.

		{'code': 'var x = 0;', 'error': false},
		{'code': 'var x,x;', 'error': true},
		{'code': 'var x=2,x=5;', 'error': true},
		{'code': 'var x,x,x;', 'error': true},
		{'code': 'var x;\nconst x=3;', 'error': true},
		{'code': 'var x;\nfunction x() {}', 'error': true},
		{'code': 'var x;\nclass x {}', 'error': true}
	];
	processTestCases(cases, validateDuplicateDeclarations, logger);
};