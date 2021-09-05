import { animationSetupFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/animationSetupFixer.js';
import { processTestCase } from './processTestCase.js';

export function testAnimationSetupFixer(logger) {
	const cases = [
		{'code': 'to animation.setup\noutput 5\nend', 'to': 'to animation.setup\noutput 5\nend', 'logged': false},
		{'code': 'to animation.setup\nend', 'to': 'to animation.setup\noutput 10 end', 'logged': true},
		{'code': 'to animation.setup\nstop\nend', 'to': 'to animation.setup\n\noutput 10 end', 'logged': true},
		{'code': 'to animation.setup :x\nstop\nend', 'to': 'to animation.setup \n\noutput 10 end', 'logged': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processTestCase(caseInfo, animationSetupFixer, logger);
	});
};