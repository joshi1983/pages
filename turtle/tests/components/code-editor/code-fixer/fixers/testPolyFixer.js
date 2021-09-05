import { polyFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/polyFixer.js';
import { processTestCase } from './processTestCase.js';

export function testPolyFixer(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'polyEnd', 'logged': false},
		{'code': 'polyStart', 'logged': false},
		{'code': 'polyStart polyEnd', 'to': ' ', 'logged': true},
		{'code': 'polyStart circleRight 100 polyEnd', 'to': ' circleRight 100 ', 'logged': true},
		{'code': 'polyStart circleLeft 100 polyEnd', 'to': ' circleLeft 100 ', 'logged': true},
		{'code': 'polyStart CIRCLELEFT 100 polyEnd', 'to': ' CIRCLELEFT 100 ', 'logged': true},
		{'code': 'polyStart setColors "orange circleRight 100 polyEnd',
			'to': ' setColors "orange circleRight 100 ',
			'logged': true
		},
		{'code': 'to p\npolyEnd\npolyStart\n fd 100\nright 90\nfd 100\noutput 100\nend\npolyStart circleLeft p\npolyEnd',
			'logged': false
		}/* procedure p ends the path so the fixer shouldn't do anything with the global polyStart and polyEnd */
	]
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		caseInfo.compareTreeSettings = {'excludeIndexProperties': true};
		processTestCase(caseInfo, polyFixer, logger);
	});
};