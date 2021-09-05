import { getAnimationSetup } from '../../../../modules/drawing/vector/animation/getAnimationSetup.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testCodeToProgram } from '../../../helpers/testCodeToProgram.js';

export function testGetAnimationSetup(logger) {
	const cases = [
		{'code': '', 'result': 10},
		{'code': 'to animation.setup\nend', 'result': 10},
		{'code': 'to animation.setup\noutput "hi\nend', 'result': 10},
		{'code': 'to animation.setup\noutput 20\nend', 'result': 20},
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
			if (result !== caseInfo.result)
				plogger(`Expected ${caseInfo.result} but got ${result} for code ${caseInfo.code}`);
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