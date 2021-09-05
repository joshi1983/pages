import { processValidationTestCase } from './processValidationTestCase.js';
import { validateOutputAndStopCalls } from '../../../../modules/parsing/parse-tree-analysis/validation/validateOutputAndStopCalls.js';

export function testValidateOutputAndStopCalls(logger) {
	const cases = [
		{'code': '', 'warn': false, 'error': false},
		{'code': 'output 5', 'error': true}, // "output" can not be called outside of a procedure.
		{'code': 'fd 10\noutput 5', 'error': true}, // "output" can not be called outside of a procedure.
		{'code': 'output 5\nfd 10', 'error': true}, // "fd 10" is unreachable.  
		// This would be bad because "output" is called outside of a procedure too.
		{'code': 'to hi\noutput 5\nend', 'error': false},
		{'code': 'to hi\noutput 5\nfd 10\nend', 'error': true}, // error because "fd 10" is unreachable.
		{'code': 'to hi\nif 1 < 2 [output 5]\nend', 'error': false},
		{'code': 'to hi\nif 1 < 2 [output 5\nfd 10]\nend', 'error': true},
		{'code': 'to hi\nif 1 > 2 [output 5]\nfd 10\nend', 'error': false},
		{'code': 'to hi\nifelse 1 > 2 [output 5] [output 10]\nfd 10\nend', 'error': true},
		{'code': 'to hi\noutput 5\nend\nfd 10', 'error': false},

		{'code': 'stop', 'error': true}, // stop must be called in a procedure and nowhere else.
		{'code': 'fd 10\nstop', 'error': true},
		{'code': 'stop\nfd 10', 'error': true},
		{'code': 'to hi\nstop\nend', 'error': false},
		{'code': 'to hi\nstop\nfd 10\nend', 'error': true}, // error because "fd 10" is unreachable.
		{'code': 'to hi\nif 1 < 2 [stop]\nend', 'error': false},
		{'code': 'to hi\nif 1 < 2 [stop\nfd 10]\nend', 'error': true}, // The "fd 10" in the if-statement is not reachable.
		{'code': 'to hi\nif 1 > 2 [stop]\nfd 10\nend', 'error': false},
		{'code': 'to hi\nifelse 1 > 2 [stop] [stop]\nfd 10\nend', 'error': true}, // error because "fd 10" is unreachable.
		{'code': 'to hi\nstop\nend\nfd 10', 'warn': false, 'error': false},

		{'code': 'to hi\nif 1 > 2 [stop] output 5\nend\nfd 10', 'warn': true, 'error': false}, 
		// warn because mixing output with stop.
		{'code': 'to hi\nstop\nend\nto yo\noutput 5\nend\nfd 10', 'warn': false, 'error': false}, 
		// hi and yo are separate procedures so no problem that 1 uses stop and the other uses output.
	];
	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateOutputAndStopCalls);
	});
};