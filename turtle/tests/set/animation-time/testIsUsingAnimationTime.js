import { getCachedParseTreeFromCode } from '../../helpers/getCachedParseTreeFromCode.js';
import { isUsingAnimationTime } from '../../../modules/set/animation-time/isUsingAnimationTime.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

function testCodeUsingAnimationTime(logger) {
	const cases = [
		{'in': 'fd 10', 'out': false},
		{'in': 'fd animation.duration', 'out': false},
		{'in': 'fd animation.time', 'out': true},
		{'in': 'fd animation.t', 'out': false},
	];
	testInOutPairs(cases, function(code) {
		return isUsingAnimationTime(undefined, code);
	}, logger);
}

function testExecuterUsingAnimationTime(logger) {
	const cases = [
		{'code': 'fd 10', 'out': false},
		{'code': 'fd 10; animation.time', 'out': false},
		{'code': 'fd 10; animation.t', 'out': false},
		{'code': 'fd 10; animation.setup', 'out': false},
		{'code': 'fd animation.time', 'out': true},
	];
	testInOutPairs(cases, function(code) {
		const tree = getCachedParseTreeFromCode(code, logger);
		const fastExecuter = {
			'program': {
				'parseTree': tree
			}
		};
		return isUsingAnimationTime(fastExecuter, code);
	}, logger);
}

export function testIsUsingAnimationTime(logger) {
	testCodeUsingAnimationTime(prefixWrapper('testCodeUsingAnimationTime', logger));
};