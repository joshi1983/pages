import { forLoopSettingsContainedListFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/forLoopSettingsContainedListFixer.js';
import { processTestCases } from './processTestCases.js';

export function testForLoopSettingsContainedListFixer(logger) {
	const cases = [
		{'code': 'for ["x 0 5] []', 'logged': false},
		{'code': 'for ["x 0 5 1] []', 'logged': false},
		{'code': 'for ["x 0 [count [1 2 3]]] [print :x]', 'logged': true,
			'to': 'for ["x 0 (count [1 2 3])] [print :x]'},
		/* In FMSLogo, the x wouldn't have a quote on it but the square brackets around the count would be valid.
		The quotes would be fixed by a different fixer which is why I put the quote on "x.
		The quote made this test focus more on the changes forLoopSettingsContainedListFixer was intended for.
		*/
	];
	processTestCases(cases, forLoopSettingsContainedListFixer, logger);
};