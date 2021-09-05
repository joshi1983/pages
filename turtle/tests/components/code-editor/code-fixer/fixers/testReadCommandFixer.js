import { processTestCase } from './processTestCase.js';
import { readCommandFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/readCommandFixer.js';

export function testReadCommandFixer(logger) {
	const cases = [
		{'code': 'fd 100', 'logged': false},
		{'code': 'setfillColor "red', 'logged': false},
		{'code': 'print fillColor', 'logged': false},
		{'code': 'fillColor', 'logged': false},
		{'code': 'fillColor []', 'logged': false},
		{'code': 'to p\nend\nfillColor p', 'logged': false},
		{'code': 'position any', 'logged': false}, // not valid but also should not cause JavaScript error.
		{'code': 'fillColor "red', 'to': 'setFillColor "red', 'logged': true},
		{'code': 'fillColor \'red\'', 'to': 'setFillColor \'red\'', 'logged': true},
		{'code': 'penColor "red', 'to': 'setPenColor "red', 'logged': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		caseInfo.compareTreeSettings = {'excludeIndexProperties': true};
		processTestCase(caseInfo, readCommandFixer, logger);
	});
};