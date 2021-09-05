import { processValidationTestCases } from './processValidationTestCases.js';
import { validateUnusedProcedures } from
'../../../../modules/parsing/parse-tree-analysis/validation/validateUnusedProcedures.js';

export function testValidateUnusedProcedures(logger) {
	const cases = [
		{'code': '', 'warn': false},
		{'code': 'to p\nend p', 'warn': false},
		{'code': 'to p\nend', 'warn': true},
		{'code': 'to p\np\nend', 'warn': true},
		{'code': 'to p\nq\nend to q\np\nend', 'warn': true},
		{'code': 'to p\nq\nend to q\np\nend q', 'warn': false},
		{'code': 'to p\nq\nend to q\np\nend p', 'warn': false},
		{'code': 'to p\nq\nend to q\np\nend  to t\np\nend t', 'warn': false},
		{'code': 'to p\nq\nend to q\np\nend  to t\np\nend', 'warn': true},

		// Don't warn for special procedures since WebLogo calls them directly.
		{'code': 'to animation.snapshotStyle\nend', 'warn': false},
		{'code': 'to animation.setup\nend', 'warn': false},
	];
	cases.forEach(caseInfo => caseInfo.error = false); // never expect error.  only warnings.
	processValidationTestCases(cases, logger, validateUnusedProcedures);
};