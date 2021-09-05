export function checkMessages(executer, turtleInfo, caseInfo, logger) {
	executer.executeInstructionsSync(1000);
	let problemFound = false;
	if (turtleInfo.settings.messages.length !== caseInfo.messages.length) {
		logger('Expected to print ' + caseInfo.messages.length + ' but printed ' + turtleInfo.settings.messages.length + ' times.  The messages actually printed were: ' + JSON.stringify(turtleInfo.settings.messages));
		problemFound = true;
	}
	else if (turtleInfo.settings.messages instanceof Array) {
		for (let i = 0; i < caseInfo.messages.length; i++) {
			const expected = caseInfo.messages[i];
			const actual = turtleInfo.settings.messages[i];
			if (actual !== expected) {
				logger('Expected message ' + expected + ' but got ' + actual + '.');
				problemFound = true;
			}
		}
	}
	return problemFound;
};