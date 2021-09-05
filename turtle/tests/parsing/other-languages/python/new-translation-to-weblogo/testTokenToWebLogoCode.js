import { processTranslationTestCase } from './processTranslationTestCase.js';

export function testTokenToWebLogoCode(logger) {
	const cases = [
		{'in': '# comment here\n# another comment\nprint("hi") # print something comment',
			'out': '; comment here\n; another comment\nprint "hi\n; print something comment'},
		{'in': '# hi', 'out': '; hi'},

		{'in': '[]', 'out': '[ ]'},
		{'in': '[[]]', 'out': '[ [ ] ]'},
		{'in': '[()]', 'out': '[ [ ] ]'},
		{'in': '([])', 'out': '[ ]'}, 
		// Since there is only 1 child token in the curved brackets, Python will interpret this as an empty list.

		{'in': '[1]', 'out': '[ 1 ]'},
		{'in': '[1,2]', 'out': '[ 1 2 ]'},
		{'in': '()', 'out': '[ ]'},
		{'in': '(1)', 'out': '1'}, // Similar to ([]), Python will treat (1) the same as 1.
		{'in': '(-1)', 'out': '-1'}, // Similar to ([]), Python will treat (-1) the same as -1.
		{'in': '(1,)', 'out': '[ 1 ]'}, // (1,) is interpretted as a tuple in Python.
		{'in': '(1,2)', 'out': '[ 1 2 ]'},
		{'in': '(1,2,3)', 'out': '[ 1 2 3 ]'},
		{'in': '((r * i)*(-1))', 'out': '( ( :r * :i ) * -1 )'},

		{'in': 'ENDMARKER()', 'out': 'endmarker'},
		// ENDMARKER shows when the Python2Parser is used.
		// This test is to ensure that no WebLogo source code accidentally
		// removes it if the same string is used in a function name.
		// The following cases are similar.
		// NEWLINE, NEW_LINE, INDENT, DEDENT text is used for tokens 
		// that are not translated.
		// We test here that the same text used in a python identifier isn't 
		// mistaken as those tokens we don't want to translate.
		{'in': 'NEWLINE()', 'out': 'newline'},
		{'in': 'NEW_LINE()', 'out': 'new_line'},
		{'in': 'INDENT()', 'out': 'indent'},
		{'in': 'DEDENT()', 'out': 'dedent'},

		{'in': `try:
	result = x // y
except ZeroDivisionError:
	print("exception")
finally:
	print('finally_case')`,
			'out': 'make "result ( pyIDiv :x :y )\nprint "finally_case'},
	{'in': `try:
	result = x // y
except ZeroDivisionError:
	print("exception")`,
			'out': 'make "result ( pyIDiv :x :y )'
		},
		{'in': '180*(squares-2)', 'out': '180 * ( :squares - 2 )'},
		{'in': '180*(squares-2)/squares', 'out': '180 * ( :squares - 2 ) / :squares'},
		{'in': 'angle = 180 - 180*(squares-2)/squares', 'out': 'make "angle 180 - 180 * ( :squares - 2 ) / :squares'},
		{'in': '1*2*3*4*5*6*7*8*9/10', 'out': '1 * 2 * 3 * 4 * 5 * 6 * 7 * 8 * 9 / 10'},
		{'in': '\'hello \' + \'world\'', 'out': '\'hello world\''},
		{'in': 'list1.append(5)', 'out': 'queue2 "list1 5'},
		{'in': 'print(list1[0])', 'out': 'print item 1 :list1'},
		{'in': 't.pencolor(colors[x%6])', 'out': 'setPenColor convertColorUsingMode\nitem 1 + ( modulo :x 6 ) :colors'}
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processTranslationTestCase(caseInfo, logger);
	});
};