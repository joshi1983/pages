import { getCachedParseTreeFromCode } from
'../../../helpers/getCachedParseTreeFromCode.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { shouldTestDifferentAnimationTimes } from
'../../../../modules/components/code-editor/quality-report/shouldTestDifferentAnimationTimes.js';

export function testShouldTestDifferentAnimationTimes(logger) {
	const cases = [
	{'code': '', 'out': false},
	{'code': 'fd 1', 'out': false},
	{'code': 'fd animation.time', 'out': true},
	{'code': 'fd animation.timeRatio', 'out': true},
	{'code': 'fd animation.clampedTimeRatio', 'out': true},
	{'code': 'fd animation.duration', 'out': false},
	{'code': 'to p\nfd animation.time\nend', 'out': false},
	{'code': 'to p\nfd animation.time\nend p', 'out': true},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const result = shouldTestDifferentAnimationTimes(tree);
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but found ${result}`);
	});
};