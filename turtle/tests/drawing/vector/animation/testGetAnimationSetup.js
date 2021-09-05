import { getAnimationSetup } from '../../../../modules/drawing/vector/animation/getAnimationSetup.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testCodeToProgram } from '../../../helpers/testCodeToProgram.js';

export function testGetAnimationSetup(logger) {
	const cases = [
		{'code': '', 'resultDuration': 10, 'resultThumbnailTime': 0},
		{'code': 'to animation.setup\nend', 'resultDuration': 10, 'resultThumbnailTime': 0},
		{'code': 'to animation.setup\noutput "hi\nend', 'resultDuration': 10, 'resultThumbnailTime': 0},
		{'code': 'to animation.setup\noutput 20\nend', 'resultDuration': 10, 'resultThumbnailTime': 0},
		{'code': 'to animation.setup\noutput 20\nend', 'resultDuration': 10, 'resultThumbnailTime': 0}, // suppposed to return a Map.
		{'code': 'to animation.setup\nlocalmake "result createPList\noutput :result\nend',
			'resultDuration': 10,
			'resultThumbnailTime': 0
		},
		{'code': 'to animation.setup\nlocalmake "result createPList\nsetProperty "result "duration 20\noutput :result\nend',
			'resultDuration': 20,
			'resultThumbnailTime': 0
		},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const program = testCodeToProgram(caseInfo.code, logger, undefined, false);
		if (program === undefined) {
			plogger('program expected to not be undefined but it is');
			return;
		}
		let isResolved = false;
		getAnimationSetup(program).then(function(result) {
			if (!(result instanceof Map))
				plogger(`Expected a Map but got ${result}`);
			else {
				const resultDuration = result.get('duration');
				if (resultDuration !== caseInfo.resultDuration)
					plogger(`Expected ${caseInfo.resultDuration} but got ${resultDuration} for code ${caseInfo.code}`);
				const resultThumbnailTime = result.get('thumbnailTime');
				if (resultThumbnailTime !== caseInfo.resultThumbnailTime)
					plogger(`Expected ${caseInfo.resultThumbnailTime} but got ${resultThumbnailTime} for code ${caseInfo.code}`);
			}
			isResolved = true;
		}).catch(function(e) {
			console.error(e);
			plogger(`Failed for code: ${caseInfo.code}.  Error message: ${e}`);
		});
		function checkResolved() {
			if (!isResolved)
				plogger('Case with code ' + caseInfo.code + ' unresolved after 5000 milliseconds');
		}
		setTimeout(checkResolved, 5000);
	});
};