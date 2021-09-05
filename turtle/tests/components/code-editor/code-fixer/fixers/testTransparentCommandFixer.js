import { processTestCase } from './processTestCase.js';
import { transparentCommandFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/transparentCommandFixer.js';

export function testTransparentCommandFixer(logger) {
	const cases = [
		{'code': '"transparent', 'logged': false},
		// not valid but should not be changed by transparentCommandFixer.

		{'code': 'forward "transparent', 'logged': false},
		// The invalid argument type won't be fixed by removing the quote so don't change it.

		{'code': 'print "transparent', 'logged': false},
		// print can also print strings so "transparent is not invalid.

		{'code': 'setFillColor "transparent', 'to': 'setFillColor transparent', 'logged': true},
		{'code': 'setPenColor "transparent', 'to': 'setPenColor transparent', 'logged': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		caseInfo.compareTreeSettings = {'excludeIndexProperties': true};
		processTestCase(caseInfo, transparentCommandFixer, logger);
	});
};