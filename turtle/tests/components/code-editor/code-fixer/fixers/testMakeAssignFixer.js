import { makeAssignFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/makeAssignFixer.js';
import { processTestCases } from './processTestCases.js';

/*
Mainly used for Logo 3D.  Learn more about Logo 3D at:
json/logo-migrations/Logo_3D.json
*/
export function testMakeAssignFixer(logger) {
	const cases = [
		{'code': 'print "Define', 'logged': false},
		{'code': 'make local', 'logged': false, 'ignoreParseErrors': true},
		{'code': 'make local =', 'logged': false, 'ignoreParseErrors': true},
		{'code': 'make local x=', 'logged': false},
		{'code': 'make local "x=', 'logged': false},
		{'code': 'make "x 4', 'logged': false},
		{'code': 'make x=4', 'to': 'make "x 4', 'logged': true, 'ignoreParseErrors': true},
		{'code': 'make x=4 print x', 'to': 'make "x 4 print :x', 'logged': true},
		{'code': 'make local x=4 print x', 'to': 'localmake  "x 4 print :x', 'logged': true},
		{'code': 'make x=4\nprint "hi',
			'to': 'make "x 4\nprint "hi',
			'logged': true
		},
		{'code': 'make local x=4', 'to': 'localmake  "x 4', 'logged': true},
		{'code': 'make fc=random 361', 'to': 'make "fc random 361', 'logged': true, 'ignoreParseErrors': true},
		{'code': 'make dd=dd+6', 'to': 'make "dd :dd+6', 'logged': true, 'ignoreParseErrors': true},
		{'code': 'make dd = 1 repeat 50 []', 'to': 'make "dd  1 repeat 50 []', 'logged': true},
		{'code': 'make dd = 1 make dd = 3', 'to': 'make "dd  1 make "dd  3', 'logged': true, 'ignoreParseErrors': true},
	];
	processTestCases(cases, makeAssignFixer, logger);
};