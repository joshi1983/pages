import { mightBeRunnableCode } from '../../modules/parsing/mightBeRunnableCode.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';

export function testMightBeRunnableCode(logger) {
	const cases = [
		{'code': '', 'result': false},
		{'code': '; hello', 'result': false},
		{'code': '; hi\n;yo', 'result': false},
		{'code': 'fd 100', 'result': true},
		{'code': '; hello\nfd 100', 'result': true},
		{'code': '; hello\nfd 100; another comment', 'result': true},
		{'code': '; hello\nfd 100\n; another comment', 'result': true},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code: ${caseInfo.code}`, logger);
		const result = mightBeRunnableCode(caseInfo.code);
		if (result !== caseInfo.result)
			plogger(`Expected result to be ${caseInfo.result} but got ${result}`);
	});
};