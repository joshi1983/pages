import { processTestCases } from './processTestCases.js';
import { simplifySetHeadingFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/simplifySetHeadingFixer.js';

export function testSimplifySetHeadingFixer(logger) {
	const cases = [
		{'code': 'setHeading 0', 'logged': false},
		{'code': 'right 90', 'logged': false},
		{'code': 'left 90', 'logged': false},
		{'code': 'right 90 print "hi left 90', 'logged': false},
		{'code': 'setHeading 10 right 90', 'logged': false},
		/*
		This could be simplified more to setHeading 100
		but the case is being tested to ensure no changes are made that mistranslate it
		before that future work is completed.
		*/
		{'code': 'right 90 setHeading heading', 'logged': false},
		/*
		This could be simplified to 'right 90'.
		The test case is to ensure the code doesn't get "fixed" into code that behaves differently than the source.
		*/
		{'code': 'to p\noutput 5 + heading\nend\nright 90 setHeading p', 'logged': false},
		/*
		This could be simplified to 'right 95' or 'right 90 + 5' but
		this test case is verifying that nothing worse happens like changing
		the final heading angle from what the original code would use.
		*/
		{'code': 'to p\noutput 5 + heading\nend\nright 90 left p', 'logged': false},
		/*
		Similar to above, this could be simplified more but a mistranslation is
		what the case is intended to check for.
		*/
		{'code': 'to p\noutput 5 + heading\nend\nright p left 90', 'logged': false},

		{'code': 'right 90 left 40', 'to': 'right 90 - 40', 'logged': true},
		{'code': 'right (90) left 40', 'to': 'right (90) - 40', 'logged': true},
		{'code': 'make "x 10 right 90 + :x left 40', 'to': 'make "x 10 right 90 + :x - 40', 'logged': true},
		{'code': 'make "x 10 right 90 left 40 + :x', 'to': 'make "x 10 right 90 - (40 + :x)', 'logged': true},
		{'code': 'make "x 30 right 90 left :x', 'to': 'make "x 30 right 90 - :x', 'logged': true},
		{'code': 'right 90 left 40 left 10', 'to': 'right 90 - 40 - 10', 'logged': true},
		{'code': 'setHeading 0 right 90 left 40 left 10', 'to': 'setHeading 0 right 90 - 40 - 10', 'logged': true},
		{'code': 'right 90 left 40 setHeading 0', 'to': '    setHeading 0', 'logged': true},
		{'code': 'right 90 left 40 setHeading 10 + :x', 'to': '    setHeading 10 + :x', 'logged': true},
	];
	processTestCases(cases, simplifySetHeadingFixer, logger);
};