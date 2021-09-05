import { animationSetupFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/animationSetupFixer.js';
import { processTestCase } from './processTestCase.js';

export function testAnimationSetupFixer(logger) {
	const cases = [
		{'code': 'to animation.setup\nlocalmake "result createPList\nsetProperty "result "duration 10\noutput :result\nend', 'logged': false},
		{'code': 'to animation.setup\nlocalmake "result createPList\nsetProperty "result "duration animation.time\noutput :result\nend',
			'to': 'to animation.setup\nlocalmake "result createPList\nsetProperty "result "duration 0\noutput :result\nend',
			'logged': true
		}
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processTestCase(caseInfo, animationSetupFixer, logger);
	});
};