import { leafsInDataListsToStringLiteralsFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/leafsInDataListsToStringLiteralsFixer.js';
import { processTestCase } from './processTestCase.js';

export function testLeafsInDataListsToStringLiteralsFixer(logger) {
	const cases = [
		{'code': 'print ["hi]', 'logged': false},
		{'code': 'print [hello world 5]', 'to': 'print ["hello "world 5]', 'logged': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		caseInfo.compareTreeSettings = {'excludeIndexProperties': true};
		processTestCase(caseInfo, leafsInDataListsToStringLiteralsFixer, logger);
	});
};