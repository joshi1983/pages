import { getCachedParseTreeFromCode } from '../../helpers/getCachedParseTreeFromCode.js';
import { isUsingAnimationTime } from '../../../modules/set/animation-time/isUsingAnimationTime.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testCodeUsingAnimationTime(logger) {
	const cases = [
		{'in': 'fd 10', 'out': false},
		{'in': 'fd animation.duration', 'out': false},
		{'in': 'fd animation.time', 'out': true},
		{'in': 'fd animation.t', 'out': false},

		// animation.timeRatio and animation.clampedTimeRatio indirectly use animation.time.
		{'in': 'fd animation.timeRatio', 'out': true},
		{'in': 'fd animation.clampedTimeRatio', 'out': true},
	];
	testInOutPairs(cases, function(code) {
		return isUsingAnimationTime(undefined, code);
	}, logger);
}

function testExecuterUsingAnimationTime(logger) {
	const cases = [
		{'in': 'fd 10', 'out': false},
		{'in': 'fd 10; animation.time', 'out': false},
		{'in': 'fd 10; animation.t', 'out': false},
		{'in': 'fd 10; animation.setup', 'out': false},
		{'in': 'fd animation.time', 'out': true},
		{'in': 'fd animation.timeRatio', 'out': true},
		{'in': 'fd animation.clampedTimeRatio', 'out': true},
	];
	testInOutPairs(cases, function(code) {
		const cachedParseTree = getCachedParseTreeFromCode(code, logger);
		const root = cachedParseTree.root;
		const fastExecuter = {
			'program': {
				'parseTree': root
			}
		};
		return isUsingAnimationTime(fastExecuter, code);
	}, logger);
}

export function testIsUsingAnimationTime(logger) {
	wrapAndCall([
		testCodeUsingAnimationTime,
		testExecuterUsingAnimationTime
	], logger);
};