import { validateInfiniteLoops } from '../../../../modules/parsing/parse-tree-analysis/validation/validateInfiniteLoops.js';
import { processValidationTestCase } from './processValidationTestCase.js';

export function testValidateInfiniteLoops(logger) {
	const cases = [
		{'code': '', 'warn': false},
		{'code': 'while false [fd 10]', 'warn': false},
		{'code': 'while true [fd 10]', 'warn': true},
		{'code': 'while true [fd 10 break]', 'warn': false},
		{'code': 'make "x 0 while :x < 3 [fd 10 make "x :x + 1]', 'warn': false},
		{'code': 'forever [fd 10]', 'warn': true},
		{'code': 'forever [fd 10 break]', 'warn': false},
		{'code': 'do.while [fd 10] true', 'warn': true},
		{'code': 'do.while [fd 10 break] true', 'warn': false},
		{'code': 'until false [fd 10]', 'warn': true},
		{'code': 'until false [fd 10 break]', 'warn': false},
		{'code': 'make "x 0 do.while [fd 10 make "x :x + 1] :x < 3', 'warn': false},
		{'code': 'to hi\nend', 'warn': false},
		{'code': 'to hi\nwhile true [fd 10]\nend', 'warn': true},
		{'code': 'to hi\nwhile false [fd 10]\nend', 'warn': false},
		{'code': 'to hi\nwhile true [fd 10\noutput 10]\nend', 'warn': false},
		{'code': 'to hi\nwhile true [fd 10\nbreak]\nend', 'warn': false},
		{'code': 'to hi\nif false [hi]\nend', 'warn': false},
		{'code': 'to hi\nifelse false [hi] [hi]\nend', 'warn': true},
		{'code': 'to hi\nifelse true [hi] [hi]\nend', 'warn': true},
		{'code': 'to hi\nhi\nend', 'warn': true},
		{'code': 'to hi\nhi\noutput 10\nend', 'warn': true},
		{'code': 'for ["x 1 5 1] []', 'warn': false},
		{'code': 'for ["x 1 5 -1] []', 'warn': true},
		{'code': 'for ["x 1 5 -1] [break]', 'warn': false},
		{'code': 'to hi\nfor ["x 1 5 -1]\n[output 10]\nend', 'warn': false},
		{'code': 'to hi\nfor ["x 1 5 -1]\n[stop]\nend', 'warn': false},
		{'code': 'to spiral_recur :n\nif :n < 1 [stop]\nfd :n\nrt 20\nspiral_recur 0.95 * :n\nend', 'warn': false},
		{'code': 'to spiral_recur :n\nfd :n\nrt 20\nspiral_recur 0.95 * :n\nend', 'warn': true},
		{'code': 'to hi\nforever [\noutput 10]\nend', 'warn': false},
		{'code': 'to hi\nforever [\nstop]\nend', 'warn': false},
		{'code': 'to hi\nforever [\nbreak]\nend', 'warn': false},
		{'code': 'to hi\ndo.while [\noutput 10] true\nend', 'warn': false},
		{'code': 'to hi\ndo.while [\nstop] true\nend', 'warn': false},
		{'code': 'to hi\ndo.while [\nbreak] true\nend', 'warn': false},
		{'code': 'to p', 'warn': false}, // not valid program but there are no infinite loops either.
		{'code': 'to p\n', 'warn': false}, // not valid program but there are no infinite loops either.
		{'code': `to p :size
	while :size > 0.5 [
		localmake "size :size * 0.98
	]
end

p 100`, 'warn': false},
		{
			'code': `to p\nrepeat 2 [p]\nend`,
			'warn': true
		},
		{
			'code': `to p\nrepeat 0 [p]\nend`,
			'warn': false // never runs the recursive p so no problem
		},
		{
			'code': `to p :numRepeats\nrepeat :numRepeats [p 2]\nend\np 0`,
			'warn': false // might not run the recursive p so don't warn.
		},
		{
			'code': 'to animation.setup\nforever [\n]\nend',
			'error': true
		},
		{
			'code': 'to animation.snapshotstyle\nforever [\n]\nend',
			'error': true
		},
		{
			'code': 'to p\nrepeat 2 output 3\nend',
			'error': false
		},
		{
			'code': 'repeat 2 [ repeat 3 [break]]',
			'warn': false,
			'error': false
		},
		{
			'code': 'forever [ repeat 3 [break]]',
			'warn': true // the break is only for the repeat loop.
			// forever is still infinite.
		}
	];
	cases.forEach(function(caseInfo) {
		if (caseInfo.error === undefined)
			caseInfo.error = false
	}); // usually the validator should produces only warnings.
	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateInfiniteLoops);
	});
};