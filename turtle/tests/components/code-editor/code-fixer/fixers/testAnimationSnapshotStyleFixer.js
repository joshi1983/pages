import { animationSnapshotStyleFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/animationSnapshotStyleFixer.js';
import { processTestCase } from './processTestCase.js';

export function testAnimationSnapshotStyleFixer(logger) {
	const cases = [
		{'code': 'to animation.snapshotstyle\noutput plistCreate\nend', 'to': 'to animation.snapshotstyle\noutput plistCreate\nend', 'logged': false},
		{'code': 'to animation.snapshotstyle\nstop\nend', 'to': 'to animation.snapshotstyle\n\nend', 'logged': true},
		{'code': 'to animation.snapshotstyle :x\nend', 'to': 'to animation.snapshotstyle \nend', 'logged': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processTestCase(caseInfo, animationSnapshotStyleFixer, logger);
	});
};