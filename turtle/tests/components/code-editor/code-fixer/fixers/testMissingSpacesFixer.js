import { missingSpacesFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/missingSpacesFixer.js';
import { processTestCase } from './processTestCase.js';

export function testMissingSpacesFixer(logger) {
	const cases = [
		{'code': '', 'to': '', 'logged': false},
		{'code': 'print count5', 'to': 'print count5', 'logged': false},
		{'code': 'print 5', 'to': 'print 5', 'logged': false},
		{'code': 'forward 5', 'to': 'forward 5', 'logged': false},
		{'code': 'forward :x', 'to': 'forward :x', 'logged': false},
		{'code': 'forward:x', 'to': 'forward :x', 'logged': true},
		{'code': 'forward5', 'to': 'forward 5', 'logged': true},
		{'code': 'print5', 'to': 'print 5', 'logged': true},
		{'code': 'print15', 'to': 'print 15', 'logged': true},
	];
	cases.forEach(function(caseInfo) {
		processTestCase(caseInfo, missingSpacesFixer, logger);
	});
};