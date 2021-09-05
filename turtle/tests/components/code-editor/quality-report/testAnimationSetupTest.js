import { AnimationSetupTest } from
'../../../../modules/components/code-editor/quality-report/AnimationSetupTest.js';
import { compileOptionsArray } from
'../../../parsing/execution/compileOptionsArray.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { testCodeToProgram } from
'../../../helpers/testCodeToProgram.js';

const compileOptions = compileOptionsArray[compileOptionsArray.length - 1];

function contains(messages, s) {
	for (const m of messages) {
		if (m.indexOf(s) !== -1)
			return true;
	}
	return false;
}

function runTest(caseInfo, logger) {
	const program = testCodeToProgram(caseInfo.code, logger, compileOptions, false);
	const animationSetupTester = new AnimationSetupTest(program);
	const messages = [];
	let errorFound = false, warnFound = false;
	animationSetupTester.addEventListener('animation-setup-result', function(eventData) {
		const details = eventData.details;
		if (caseInfo.errorFound !== undefined && errorFound !== caseInfo.errorFound)
			logger(`Expected errorFound of ${caseInfo.errorFound} but actual errorFound=${errorFound}`);
		if (caseInfo.warnFound !== undefined && warnFound !== caseInfo.warnFound)
			logger(`Expected warnFound of ${caseInfo.warnFound} but actual warnFound=${warnFound}`);
		if (caseInfo.duration !== details.duration)
			logger(`Expected duration to be ${caseInfo.duration} but got ${details.duration}`);
		if (caseInfo.errorMessagesContain !== undefined) {
			for (const messageSubstring of caseInfo.errorMessagesContain) {
				if (!contains(messages, messageSubstring))
					logger(`Expected to find ${messageSubstring} in at least one of the error or warning messages but did not.  The messages were ${messages.join(', ')}`);
			}
		}
	});
	function checkEventData(eventData) {
		if (typeof eventData !== 'object')
			logger(`eventData for error expected to be an object but got ${eventData}`);
		else if (typeof eventData.details !== 'object')
			logger(`eventData.details for error expected to be an object but got ${eventData.details}`);
		else if (typeof eventData.details.msg !== 'string')
			logger(`Expected every error event to have a string msg value but found msg = ${eventData.details.msg}`);
		else
			return true; // indicate valid
	}
	animationSetupTester.addEventListener('warning', function(eventData) {
		warnFound = true;
		if (checkEventData(eventData) === true) {
			const details = eventData.details;
			messages.push(details.msg);
		}
	});
	animationSetupTester.addEventListener('error', function(eventData) {
		errorFound = true;
		if (checkEventData(eventData) === true) {
			const details = eventData.details;
			messages.push(details.msg);
		}
	});
	animationSetupTester.start();
	setTimeout(function() {
		animationSetupTester.dispose();
	}, 10000);
}

export function testAnimationSetupTest(logger) {
	const cases = [
	{'code': '', 'errorFound': false, 'duration': 10},
	{'code': 'to animation.setup :x\nend', 'errorFound': true, 'duration': 10},
	{'code': `to animation.setup
	localmake "result createPList
	setProperty "result "duration 10
	output :result
end`, 'errorFound': false, 'duration': 10},
	{'code': `to animation.setup
	localmake "result createPList
	setProperty "result "duration 4
	output :result
end`, 'errorFound': false, 'duration': 4},
	{'code': `to animation.setup
	localmake "result createPList
	setProperty "result "duration 'hi'
	output :result
end`, 'errorFound': true,
	'errorMessagesContain': ['duration'],
		'duration': 10},
	{'code': `to animation.setup
	localmake "result createPList
	setProperty "result "duration 9
	setProperty "result "hi 3
	output :result
end`, 'errorFound': false, 'warnFound': true,
	'errorMessagesContain': ['hi'],
		'duration': 9},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		runTest(caseInfo, plogger);
	});
};