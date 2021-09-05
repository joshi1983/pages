import { animationSnapshotStyleFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/animationSnapshotStyleFixer.js';
import { processTestCases } from './processTestCases.js';

export function testAnimationSnapshotStyleFixer(logger) {
	const cases = [
		{'code': 'to animation.snapshotstyle\noutput createPList\nend', 'logged': false},
		{'code': 'to animation.snapshotstyle\nlocalmake "x drawing.box\noutput createPList\nend', 'logged': false},
		{'code': 'to animation.snapshotstyle\nstop\nend', 'to': 'to animation.snapshotstyle\n\nend', 'logged': true},
		{'code': 'to animation.snapshotstyle :x\nend', 'to': 'to animation.snapshotstyle \nend', 'logged': true},
	];
	processTestCases(cases, animationSnapshotStyleFixer, logger);
};