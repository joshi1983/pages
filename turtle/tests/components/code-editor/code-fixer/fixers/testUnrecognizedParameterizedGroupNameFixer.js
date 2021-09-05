import { unrecognizedParameterizedGroupNameFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/unrecognizedParameterizedGroupNameFixer.js';
import { processTestCase } from './processTestCase.js';

export function testUnrecognizedParameterizedGroupNameFixer(logger) {
	const cases = [
		{'code': 'pendown', 'to': 'pendown', 'logged': false},
		{'code': 'pen down', 'to': 'pendown ', 'logged': true},
		{'code': 'pri nt 5', 'to': 'print  5', 'logged': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processTestCase(caseInfo, unrecognizedParameterizedGroupNameFixer, logger);
	});
};