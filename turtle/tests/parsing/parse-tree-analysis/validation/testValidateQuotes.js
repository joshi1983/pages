import { processValidationTestCases } from './processValidationTestCases.js';
import { validateQuotes } from '../../../../modules/parsing/parse-tree-analysis/validation/validateQuotes.js';

export function testValidateQuotes(logger) {
	const cases = [
		{'code': '', 'error': false, 'warn': false, 'tip': false},
		{'code': 'fd 1', 'error': false, 'warn': false, 'tip': false},
		{'code': 'setpencolor "red', 'error': false, 'warn': false, 'tip': false},
		{'code': 'setpencolor"red', 'error': false, 'warn': false, 'tip': true},
		{'code': 'print "', 'error': false, 'warn': false, 'tip': false},
		{'code': 'for ["x 1 5 1] [print :x]', 'error': false, 'warn': false},
		{'code': 'print ("x)', 'error': false, 'warn': false, 'tip': false},
		{'code': 'for [\n"x 1 5 1] [print :x]', 'error': false, 'warn': false},
		{'code': 'to f\nprint 4\nend"bla', 'error': false, 'warn': false, 'tip': true},
		// weird to put a string immediately after the end of a procedure.

		{'code': 'make "x 1\nprint :x"bla', 'error': false, 'warn': false, 'tip': true},
		// some other validator should log an error but validateQuotes is 
		// expected to just warn for the :x"bla part of this code.

		{'code': 'make "x 1\nprint :x="bla', 'error': false, 'warn': false, 'tip': true},
		{'code': 'make"oldHeading heading', 'error': false, 'warn': false, 'tip': true},
		{'code': 'print "hello"', 'error': true},
		{'code': 'print "', 'error': false},
		{'code': 'print \'\'', 'error': false},
	];
	processValidationTestCases(cases, logger, validateQuotes);
};