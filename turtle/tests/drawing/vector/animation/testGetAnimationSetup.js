import { getAnimationSetup } from '../../../../modules/drawing/vector/animation/getAnimationSetup.js';
import { testCodeToProgram } from '../../../helpers/testCodeToProgram.js';

export function testGetAnimationSetup(logger) {
	const cases = [
		{'code': '', 'result': 10},
		{'code': 'to animation.setup\nend', 'result': 10},
		{'code': 'to animation.setup\noutput "hi\nend', 'result': 10},
		{'code': 'to animation.setup\noutput 20\nend', 'result': 20},
	];
	cases.forEach(function(caseInfo) {
		const program = testCodeToProgram(caseInfo.code, logger);
		let isResolved = false;
		getAnimationSetup(program).then(function(result) {
			if (result !== caseInfo.result)
				logger(`Expected ${caseInfo.result} but got ${result} for code ${caseInfo.code}`);
			isResolved = true;
		}).catch(function(e) {
			console.error(e);
			logger(`Failed for code: ${caseInfo.code}.  Error message: ${e}`);
		});
		function checkResolved() {
			if (!isResolved)
				logger('Case with code ' + caseInfo.code + ' unresolved after 5000 milliseconds');
		}
		setTimeout(checkResolved, 5000);
	});
};