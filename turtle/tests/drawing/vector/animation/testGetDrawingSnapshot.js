import { getDrawingSnapshot } from '../../../../modules/drawing/vector/animation/getDrawingSnapshot.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testCodeToProgram } from '../../../helpers/testCodeToProgram.js';

export function testGetDrawingSnapshot(logger) {
	const cases = [
		{'time': 0, 'code': '', 'isEmpty': true},
		{'time': 0, 'code': 'fd 100', 'isEmpty': false},
		{'time': 0, 'code': 'setLineCap "butt\nsetLineJoinStyle "round\nfd animation.time', 'isEmpty': true},
		{'time': 0, 'code': 'setLineCap "butt\nsetLineJoinStyle "round\nfd animation.timeRatio', 'isEmpty': true},
		{'time': 0, 'code': 'setLineCap "butt\nsetLineJoinStyle "round\nfd animation.clampedTimeRatio', 'isEmpty': true},
		{'time': 0, 'code': 'setLineCap "round\nfd animation.time', 'isEmpty': false},
		{'time': 0, 'code': 'if animation.time < 1 [\n fd 100 \n]', 'isEmpty': false},
		{'time': 0, 'code': 'if animation.time > 1 [\n fd 100 \n]', 'isEmpty': true},
		{'time': 0, 'code': 'if animation.time > 1 [\n fd 100 \n]\nto animation.setup\nlocalmake "result createPList\nsetProperty "result "duration 20\noutput :result\nend', 'isEmpty': true},

		{'time': 2, 'code': 'if animation.time > 1 [\n fd 100 \n]\nto animation.setup\nlocalmake "result createPList\nsetProperty "result "duration 20\noutput :result\nend', 'isEmpty': false},
		{'time': 2, 'code': 'if animation.time > 1 [\n fd 100 \n]\nto animation.setup\noutput createPList2 [["duration 20]]\nend', 'isEmpty': false},
		// same as previous case but just wanted to try refactoring with createPList2.
		
	];
	cases.forEach(function(caseInfo, caseIndex) {
		const plogger = prefixWrapper(`Case ${caseIndex}`, logger);
		const program = testCodeToProgram(caseInfo.code, plogger);
		let isResolved = false;
		getDrawingSnapshot(program, caseInfo.time, 10).then(function(drawing) {
			if (drawing.foreground.hasAnythingToClear() === caseInfo.isEmpty)
				plogger(`Expected "drawing is empty" to be ${caseInfo.isEmpty} but got ${!drawing.foreground.hasAnythingToClear()}`);
			isResolved = true;
		}).catch(function(e) {
			console.error(e);
			plogger(`Failed for code: ${caseInfo.code}, time: ${caseInfo.time} with error message: ${e}`);
		});
		function checkResolved() {
			if (!isResolved)
				plogger('Case with code ' + caseInfo.code + ' unresolved after 5000 milliseconds');
		}
		setTimeout(checkResolved, 5000);
	});
};