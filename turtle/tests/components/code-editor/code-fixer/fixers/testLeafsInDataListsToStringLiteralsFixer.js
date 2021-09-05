import { leafsInDataListsToStringLiteralsFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/leafsInDataListsToStringLiteralsFixer.js';
import { processTestCases } from './processTestCases.js';

export function testLeafsInDataListsToStringLiteralsFixer(logger) {
	const cases = [
		{'code': 'print ["hi]', 'logged': false},
		{'code': 'print [hello world 5]', 'to': 'print ["hello "world 5]', 'logged': true},
	];
	processTestCases(cases, leafsInDataListsToStringLiteralsFixer, logger);
};