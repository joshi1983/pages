import { curvedBracketFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/curvedBracketFixer.js';
import { processTestCase } from './processTestCase.js';

export function testCurvedBracketFixer(logger) {
	const cases = [
	{
		'code': 'print 1',
		'logged': false
	},
	{
		'code': 'print 3 (2 * 6)',
		'logged': false
		/*
		We want to avoid altering code in rare cases where the brackets will ultimately be
		wanted and some other changes are better.
		For example,
			print 3 (2 * 6)
			This shouldn't be changed because the best fix is more likely print 3 + (2 * 6) than print 3 2 * 6.
		*/
	},
	{
		'code': '(print 1)',
		'to': 'print 1',
		'logged': true
	},
	{
		'code': '((print 1))',
		'to': 'print 1',
		'logged': true
	},
	{
		'code': '(print ((5 - 1) + 4))',
		'to': 'print ((5 - 1) + 4)',
		'logged': true
	},
	{
		'code': 'make "to p :x\nprint :x\nend\nprocedureName "p\n(invoke :procedureName 5)',
		'logged': false
		/*
		invoke uses an arbitrary number of parameters which requires the use of curved brackets.
		Removing the square brackets would break the code.
		*/
	}
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		caseInfo.compareTreeSettings = {'excludeIndexProperties': true};
		processTestCase(caseInfo, curvedBracketFixer, logger);
	});
};