import { ArrayUtils } from '../../../../modules/ArrayUtils.js';
import { processValidationTestCases } from './processValidationTestCases.js';
import { Transparent } from '../../../../modules/Transparent.js';
import { validateAnimationSnapshotStyleProcedure } from '../../../../modules/parsing/parse-tree-analysis/validation/validateAnimationSnapshotStyleProcedure.js';

function addZoomScaleCases(cases) {
	const zCases = [
		{'s': 1, 'error': false},
		{'s': 10, 'error': false},
		{'s': 0, 'error': true},
		{'s': -1, 'error': true},
		{'s': '"hi', 'error': true},
		{'s': '[]', 'error': true},
		{'s': Transparent, 'error': true},
		{'s': 'penUp', 'error': true}
	];
	ArrayUtils.pushAll(cases, zCases.map(function(zCaseInfo) {
		return {
			'code': `to animation.snapshotstyle\nlocalmake "result createPList\nsetProperty "result "zoom.scale ${zCaseInfo.s}\noutput :result\nend\n`,
			'error': zCaseInfo.error
		};
	}));
}

export function testValidateAnimationSnapshotStyleProcedure(logger) {
	const cases = [
		{'code': '', 'error': false, 'warn': false},
		{'code': 'to p\nend', 'error': false, 'warn': false},
		{'code': 'to animation.snapshotstyle\noutput 5\nend\n', 'error': true, 'warn': false},
		{'code': 'to animation.snapshotstyle :something\noutput 5\nend\n', 'error': true, 'warn': false},
		{'code': 'to animation.snapshotstyle\nend\n', 'error': true, 'warn': false},
		{'code': 'to animation.snapshotstyle\nreturn animation.time\nend\n', 'error': true, 'warn': false},
		{'code': 'to animation.snapshotstyle\noutput animation.time\nend\n', 'error': true, 'warn': false},
		{'code': 'to animation.snapshotstyle\noutput penUp\nend\n', 'error': true, 'warn': false},
		{'code': `to animation.snapshotstyle
	localmake "result createPList
	setProperty "result "zoom.scale 5
	setProperty "result "position.y 50
	output :result
end`, 'error': false, 'warn': false}
	];
	addZoomScaleCases(cases);
	processValidationTestCases(cases, logger, validateAnimationSnapshotStyleProcedure);
};