import { animationSetupFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/animationSetupFixer.js';
import { processTestCases } from './processTestCases.js';

export function testAnimationSetupFixer(logger) {
	const cases = [
		{'code': 'to animation.setup\nlocalmake "result createPList\nsetProperty "result "duration 10\noutput :result\nend', 'logged': false},
		{'code': 'to animation.setup\nlocalmake "result createPList2 [["duration 10]]\noutput :result\nend', 'logged': false},
		{'code': 'to animation.setup\nlocalmake "result createPList\nsetProperty "result "duration animation.time\noutput :result\nend',
			'to': 'to animation.setup\nlocalmake "result createPList\nsetProperty "result "duration 0\noutput :result\nend',
			'logged': true
		},
		{'code': 'to animation.setup\nlocalmake "result createPList\nsetProperty "result "duration animation.timeRatio\noutput :result\nend',
			'to': 'to animation.setup\nlocalmake "result createPList\nsetProperty "result "duration 0\noutput :result\nend',
			'logged': true
		},
		{'code': 'to animation.setup\nlocalmake "result createPList\nsetProperty "result "duration animation.clampedTimeRatio\noutput :result\nend',
			'to': 'to animation.setup\nlocalmake "result createPList\nsetProperty "result "duration 0\noutput :result\nend',
			'logged': true
		}
	];
	processTestCases(cases, animationSetupFixer, logger);
};