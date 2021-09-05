import { ifElseFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/ifElseFixer.js';
import { processTestCase } from './processTestCase.js';

export function testIfElseFixer(logger) {
	const cases = [
		{'code': 'if true []', 'logged': false},
		{'code': 'if true [print "hi]', 'logged': false},
		{'code': 'if true [] [5]', 'logged': false},
		/* not changed because [5] is likely a data list instead of an instruction list.
		It isn't changed because leaving it unchanged should help 
		the human programmer implement a better fix.
		*/

		{'code': 'if true [] []',
			'to': 'ifelse true [] []',
			'logged': true},
		{'code': 'if true [print "hi] []',
			'to': 'ifelse true [print "hi] []',
			'logged': true},
		{'code': 'if true [print "hi] [print "bye]',
			'to': 'ifelse true [print "hi] [print "bye]',
			'logged': true},
	];
	cases.forEach(function(caseInfo) {
		caseInfo.compareTreeSettings = {'excludeIndexProperties': true};
		processTestCase(caseInfo, ifElseFixer, logger);
	});
};