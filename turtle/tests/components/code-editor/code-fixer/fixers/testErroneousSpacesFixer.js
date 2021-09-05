import { erroneousSpacesFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/erroneousSpacesFixer.js';
import { processTestCase } from './processTestCase.js';

export function testErroneousSpacesFixer(logger) {
	const cases = [
		{'code': '', 'to': '', 'logged': false},
		{'code': 'print " hi', 'to': 'print  "hi', 'logged': true},
		{'code': 'print " x', 'to': 'print  "x', 'logged': true},
		{'code': 'setProperty  :\nsetFillRadialGros pos', 'to': 'setProperty  \n:setFillRadialGros pos', 'logged': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processTestCase(caseInfo, erroneousSpacesFixer, logger);
	});
};