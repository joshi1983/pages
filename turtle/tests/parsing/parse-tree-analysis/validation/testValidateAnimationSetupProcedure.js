import { ArrayUtils } from '../../../../modules/ArrayUtils.js';
import { processValidationTestCases } from './processValidationTestCases.js';
import { Transparent } from '../../../../modules/Transparent.js';
import { validateAnimationSetupProcedure } from '../../../../modules/parsing/parse-tree-analysis/validation/validateAnimationSetupProcedure.js';

function addDurationCases(cases) {
	const dCases = [
		{'duration': 1, 'error': false},
		{'duration': 10, 'error': false},
		{'duration': 0, 'error': true},
		{'duration': -1, 'error': true},
		{'duration': '"hi', 'error': true},
		{'duration': '[]', 'error': true},
		{'duration': Transparent, 'error': true},
		{'duration': 'penUp', 'error': true}
	];
	ArrayUtils.pushAll(cases, dCases.map(function(dCaseInfo) {
		return {
			'code': `to animation.setup\nlocalmake "result createPList\nsetProperty "result "duration ${dCaseInfo.duration}\noutput :result\nend\n`,
			'error': dCaseInfo.error
		};
	}));
}

function addThumbnailTimeCases(cases) {
	const tCases = [
		{'t': -1, 'error': true},
		{'t': 0, 'error': false},
		{'t': 1, 'error': false},
		{'t': 10, 'error': false},
		{'t': 11, 'error': true},
		{'t': 110, 'error': true},
		{'t': '"hi', 'error': true},
		{'t': '[]', 'error': true},
		{'t': Transparent, 'error': true},
		{'t': 'penUp', 'error': true}
	];
	ArrayUtils.pushAll(cases, tCases.map(function(tCaseInfo) {
		return {
			'code': `to animation.setup\nlocalmake "result createPList\nsetProperty "result "duration 10\nsetProperty "result "thumbnailTime ${tCaseInfo.t}\noutput :result\nend\n`,
			'error': tCaseInfo.error
		};
	}));
};

export function testValidateAnimationSetupProcedure(logger) {
	const cases = [
		{'code': '', 'error': false, 'warn': false},
		{'code': 'to p\nend', 'error': false, 'warn': false},
		{'code': 'to animation.setup\noutput 5\nend\n', 'error': true, 'warn': false},
		{'code': 'to animation.setup :something\noutput 5\nend\n', 'error': true, 'warn': false},
		{'code': 'to animation.setup\nend\n', 'error': true, 'warn': false},
		{'code': 'to animation.setup\nreturn animation.time\nend\n', 'error': true, 'warn': false},
		{'code': 'to animation.setup\noutput animation.time\nend\n', 'error': true, 'warn': false},
		{'code': 'to animation.setup\noutput penUp\nend\n', 'error': true, 'warn': false},
	];
	addDurationCases(cases);
	addThumbnailTimeCases(cases);
	processValidationTestCases(cases, logger, validateAnimationSetupProcedure);
};