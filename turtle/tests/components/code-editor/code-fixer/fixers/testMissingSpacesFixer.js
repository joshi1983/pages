import { missingSpacesFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/missingSpacesFixer.js';
import { processTestCase } from './processTestCase.js';

export function testMissingSpacesFixer(logger) {
	const cases = [
		{'code': 'print count5', 'logged': false},
		{'code': 'print 5', 'logged': false},
		{'code': 'forward 5', 'logged': false},
		{'code': 'forward :x', 'logged': false},
		{'code': 'forward:x', 'to': 'forward :x', 'logged': true},
		{'code': 'forward5', 'to': 'forward 5', 'logged': true},
		{'code': 'forward5 6', 'to': 'forward 5 6', 'logged': true},
		{'code': 'print5', 'to': 'print 5', 'logged': true},
		{'code': 'print15', 'to': 'print 15', 'logged': true},
		{'code': 'make " x', 'logged': false},
		{'code': 'print :x + x:y', 'to': 'print :x + x :y', 'logged': true},
		{'code': 'print -x:y', 'to': 'print -x :y', 'logged': true},
		{'code': 'print :x + :x * x:y', 'to': 'print :x + :x * x :y', 'logged': true},
	];
	cases.forEach(function(caseInfo) {
		//caseInfo.compareTreeSettings = {'excludeIndexProperties': true};
		processTestCase(caseInfo, missingSpacesFixer, logger);
	});
};