import { autoRemoveFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/autoRemoveFixer.js';
import { processTestCase } from './processTestCase.js';

export function testAutoRemoveFixer(logger) {
	const cases = [
		{'code': 'print "x', 'logged': false},
		{'code': 'to window\nend', 'logged': false},
		{'code': 'to bye\nend', 'logged': false},
		{'code': 'to fullscreen\nend', 'logged': false},
		// don't remove tokens that are procedure names.

		{'code': 'zoom', 'logged': false},
		{'code': 'zoom penUp', 'logged': false}, 
		// not having a number indicates this zoom reference really needs manual review.
		// Automatically removing it would generally prevent manual review more than it helps.

		{'code': 'zoom 2', 'to': ' ', 'logged': true},
		{'code': 'fullscreen', 'to': '', 'logged': true},
		{'code': 'textscreen', 'to': '', 'logged': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		caseInfo.compareTreeSettings = {'excludeIndexProperties': true};
		processTestCase(caseInfo, autoRemoveFixer, logger);
	});
};