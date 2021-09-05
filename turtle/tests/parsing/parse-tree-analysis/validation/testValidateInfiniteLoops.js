import { validateInfiniteLoops } from '../../../../modules/parsing/parse-tree-analysis/validation/validateInfiniteLoops.js';
import { processValidationTestCase } from './processValidationTestCase.js';

export function testValidateInfiniteLoops(logger) {
	const cases = [
		{'code': '', 'warn': false, 'error': false},
		{'code': 'while false [fd 10]', 'warn': false, 'error': false},
		{'code': 'while true [fd 10]', 'warn': true, 'error': false},
		{'code': 'make "x 0 while :x < 3 [fd 10 make "x :x + 1]', 'warn': false, 'error': false},
		{'code': 'forever [fd 10]', 'warn': true, 'error': false},
		{'code': 'do.while [fd 10] true', 'warn': true, 'error': false},
		{'code': 'make "x 0 do.while [fd 10 make "x :x + 1] :x < 3', 'warn': false, 'error': false},
		{'code': 'to hi\nend', 'warn': false, 'error': false},
		{'code': 'to hi\nwhile true [fd 10]\nend', 'warn': true, 'error': false},
		{'code': 'to hi\nwhile false [fd 10]\nend', 'warn': false, 'error': false},
		{'code': 'to hi\nwhile true [fd 10\noutput 10]\nend', 'warn': false, 'error': false},
		{'code': 'to hi\nif false [hi]\nend', 'warn': false, 'error': false},
		{'code': 'to hi\nifelse false [hi] [hi]\nend', 'warn': true, 'error': false},
		{'code': 'to hi\nifelse true [hi] [hi]\nend', 'warn': true, 'error': false},
		{'code': 'to hi\nhi\nend', 'warn': true, 'error': false},
		{'code': 'to hi\nhi\noutput 10\nend', 'warn': true, 'error': false},
		{'code': 'for ["x 1 5 1] []', 'warn': false, 'error': false},
		{'code': 'for ["x 1 5 -1] []', 'warn': true, 'error': false},
		{'code': 'to hi\nfor ["x 1 5 -1]\n[output 10]\nend', 'warn': false, 'error': false},
		{'code': 'to spiral_recur :n\nif :n < 1 [stop]\nfd :n\nrt 20\nspiral_recur 0.95 * :n\nend', 'warn': false, 'error': false},
		{'code': 'to spiral_recur :n\nfd :n\nrt 20\nspiral_recur 0.95 * :n\nend', 'warn': true, 'error': false},
		{'code': 'to hi\nforever [\noutput 10]\nend', 'warn': false, 'error': false},
		{'code': 'to hi\ndo.while [\noutput 10] true\nend', 'warn': false, 'error': false},
		{'code': 'to p', 'warn': false, 'error': false}, // not valid program but there are no infinite loops either.
		{'code': 'to p\n', 'warn': false, 'error': false}, // not valid program but there are no infinite loops either.
		{'code': `to p :size
	while :size > 0.5 [
		localmake "size :size * 0.98
	]
end

p 100`, 'warn': false, 'error': false}
	];

	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateInfiniteLoops);
	});
};