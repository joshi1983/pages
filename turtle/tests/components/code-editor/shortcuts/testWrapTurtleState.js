import { assertEquals } from '../../../helpers/assertEquals.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { wrapTurtleState } from
'../../../../modules/components/code-editor/shortcuts/wrapTurtleState.js';

export function testWrapTurtleState(logger) {
	const cases = [
	{'code': '', 'cursorPosition': {'lineIndex': 0, 'colIndex': 0},
		'isReported': true},
	{'code': 'to p\nend', 'cursorPosition': {'lineIndex': 0, 'colIndex': 0},
		'isReported': false,
		'out': `to p
	localmake "oldState turtleState

	setTurtleState :oldState
end`},
	{'code': 'to p\noutput 3\nend', 'cursorPosition': {'lineIndex': 0, 'colIndex': 0},
		'isReported': false,
		'out': `to p
	localmake "oldState turtleState

	setTurtleState :oldState
output 3
end`},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		let isReported = false;
		function reportError() {
			isReported = true;
		}
		function reportSuccess() {
			
		}
		const result = wrapTurtleState(caseInfo.code, caseInfo.cursorPosition, reportError, reportSuccess);
		if (caseInfo.isReported !== undefined && isReported !== caseInfo.isReported)
			plogger(`Expected isReported to be ${caseInfo.isReported} but found ${isReported}`);
		if (caseInfo.out !== undefined && caseInfo.out !== result)
			assertEquals(caseInfo.out, result, prefixWrapper(`return value`, plogger));
	});
};