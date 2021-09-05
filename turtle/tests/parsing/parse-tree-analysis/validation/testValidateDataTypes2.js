import { processValidationTestCase } from './processValidationTestCase.js';
import { validateDataTypes2 } from '../../../../modules/parsing/parse-tree-analysis/validation/validateDataTypes2.js';

export function testValidateDataTypes2(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'make "x 5 print -:x', 'error': false},
		{'code': 'make "x "hello print -:x', 'error': true},
		{'code': 'print and true false', 'error': false},
		{'code': 'print and "tre false', 'error': true},
		{'code': 'fd 100', 'error': false},
		{'code': 'fd 100+4', 'error': false},
		{'code': 'fd sin 90', 'error': false},
		{'code': 'fd print 90', 'error': true},
		{'code': 'make "x 100\nfd :x', 'error': false},
		{'code': 'fd "x', 'error': true},
		{'code': 'fd []', 'error': true},
		{'code': 'make "x "hello\nfd :x', 'error': true},
		{'code': 'print "x - 3', 'error': true},
		{'code': 'print "x / 3', 'error': true},
		{'code': 'make "x "hello\nprint :x / 3', 'error': true},
		{'code': 'make "x 5\nprint :x / 3', 'error': false},
		{'code': 'to something :x\nprint :x\nend', 'error': false},
		{'code': 'to something :x\nforward :x\nend', 'error': false},
		{'code': 'fd fd 10', 'error': true}, // fd will return nothing which isn't compatible with the num.
		{'code': 'print fd 10', 'error': true}, // fd will return nothing can not be printed.
		{'code': 'setpencolor 1', 'error': false},
		{'code': 'setpencolor 15', 'error': false},
		{'code': 'setpencolor "red', 'error': false},
		{'code': 'setpencolor [0 0 0]', 'error': false},
		{'code': 'setpencolor [255 255 255]', 'error': false},
		{'code': 'setpencolor [1 0 0 0]', 'error': false},
		{'code': 'setpencolor [255 255 255 255]', 'error': false},
		{'code': 'setpencolor "abcdef', 'error': true},
		{'code': 'setpencolor [0 1 2 3]', 'error': false},
		{'code': 'setpencolor []', 'error': true},
		{'code': 'setpencolor [0]', 'error': true},
		{'code': 'setpencolor [0 1]', 'error': true},
		{'code': 'setfillcolor transparent', 'error': false},
		{'code': 'for ["x 1 5 1] [fd :x]', 'error': false},
		{'code': 'for ["x 1 5 1] [print :x]', 'error': false},
		{'code': 'make "x []\nqueue "x 1', 'error': false},
		{'code': 'make "x 23\nqueue "x 1', 'error': true}, // x must be a list but is a number.
		{'code': 'to p :x\nfd :x\nend\np "hello', 'error': true},
		{'code': 'to p :x\nfd :x\nend\np "hello\np 5', 'error': true},
		{'code': 'to p\nmake "x 5\nend\np\nprint :x', 'error': false},
		//{'code': 'to p\nmake "x 5\nend\nprint :x', 'error': true},
		{'code': 'to p\nmake "x 5\nend\nto p2\np\nend\np2\nprint :x', 'error': false},
		{'code': 'setFillColor mix [] [] 0.5', 'error': true},
		{'code': 'to p\nlocalmake "x []\nsetFillColor mix :x [] 0.5\nend', 'error': true},
		{'code': 'make "x []\nsetFillColor mix :x [] 0.5', 'error': true},
		{'code': 'make "x []\nsetFillColor mix :x transparent 0.5', 'error': true},
		{'code': 'MAKE "i 0\nMAKE "i :i+1\nfd :i', 'error': false},
		{'code': 'MAKE "i 0\nUNTIL :i>3 [MAKE "i :i+1 PRINT :i]', 'error': false},
		{'code': 'make "red "red\nto spike :size :color1\nmake "var1 :color1\nsetFillColor :color1\nend\nspike 100 :red', 'error': false},
		{'code': `make "color1 "#fff

to p
	localmake "numDivisions 64
	repeat :numDivisions [
		localmake "ratio repcount / :numDivisions
		setFillColor mix :color1 transparent 0.1 * :ratio * :ratio
	]
end`, 'error': false},
		{'code': `to p
	localmake "x 1
	if true [
		localmake "x 1 - power :x 2
	]
	forward 5 * ( :x )
end`, 'error': false},
	{'code': `to p
	if true [
		localmake "x 5.234
		localmake "x 1
	]
	forward 5 * (:x)
end`, 'error': false},
	{'code': 'print :x + x:y', 'error': false},
	{'code': 'setFillColor "transparent', 'error': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processValidationTestCase(caseInfo, logger, validateDataTypes2);
	});
}
