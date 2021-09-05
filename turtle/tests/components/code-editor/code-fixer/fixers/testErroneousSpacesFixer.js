import { erroneousSpacesFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/erroneousSpacesFixer.js';
import { processTestCase } from './processTestCase.js';

export function testErroneousSpacesFixer(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'print " hi', 'to': 'print  "hi', 'logged': true},
		{'code': 'print " x', 'to': 'print  "x', 'logged': true},
		{'code': 'setProperty  :\nsetFillRadialGros pos', 'to': 'setProperty  \n:setFillRadialGros pos', 'logged': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		//caseInfo.compareTreeSettings = {'excludeIndexProperties': true};
		processTestCase(caseInfo, erroneousSpacesFixer, logger);
	});
};