import { setFontFixer } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/terrapin/setFontFixer.js';
import { processTestCases } from '../processTestCases.js';

export function testSetFontFixer(logger) {
	const cases = [
	{'code': '(setFont "Arial)', 'to': 'setFontFamily "Arial', 'logged': true},
	{'code': '(setFont)', 'to': '', 'logged': true},
	{'code': '(setFont "Arial 10)', 'to': 'setFontFamilyAndSize "Arial 10', 'logged': true,
	'doNotCompareTrees': true},
	];
	processTestCases(cases, setFontFixer, logger);
};