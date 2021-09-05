import { getDrawingSnapshot } from '../../../../modules/drawing/vector/animation/getDrawingSnapshot.js';
import { testCodeToProgram } from '../../../helpers/testCodeToProgram.js';

export function testGetDrawingSnapshot(logger) {
	const cases = [
		{'time': 0, 'code': '', 'isEmpty': true},
		{'time': 0, 'code': 'fd 100', 'isEmpty': false},
		{'time': 0, 'code': 'fd animation.time', 'isEmpty': false},
		{'time': 0, 'code': 'if animation.time < 1 [\n fd 100 \n]', 'isEmpty': false},
		{'time': 0, 'code': 'if animation.time > 1 [\n fd 100 \n]', 'isEmpty': true},
		{'time': 0, 'code': 'if animation.time > 1 [\n fd 100 \n]\nto animation.setup\noutput 20\nend', 'isEmpty': true},
		{'time': 2, 'code': 'if animation.time > 1 [\n fd 100 \n]\nto animation.setup\noutput 20\nend', 'isEmpty': false}
	];
	cases.forEach(function(caseInfo) {
		const program = testCodeToProgram(caseInfo.code, logger);
		let isResolved = false;
		getDrawingSnapshot(program, caseInfo.time, 10).then(function(drawing) {
			if (drawing.foreground.hasAnythingToClear() === caseInfo.isEmpty)
				logger(`Expected "drawing is empty" to be ${caseInfo.isEmpty} but got ${!drawing.foreground.hasAnythingToClear()}`);
			isResolved = true;
		}).catch(function(e) {
			console.error(e);
			logger(`Failed for code: ${caseInfo.code}, time: ${caseInfo.time} with error message: ${e}`);
		});
		function checkResolved() {
			if (!isResolved)
				logger('Case with code ' + caseInfo.code + ' unresolved after 5000 milliseconds');
		}
		setTimeout(checkResolved, 5000);
	});
};